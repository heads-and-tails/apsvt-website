#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#import <PDFKit/PDFKit.h>
#import <Vision/Vision.h>

static CGImageRef APSVTRenderPage(PDFPage *page, CGFloat targetWidth) {
    NSRect bounds = [page boundsForBox:kPDFDisplayBoxMediaBox];
    if (bounds.size.width <= 0 || bounds.size.height <= 0) return NULL;
    CGFloat scale = targetWidth / bounds.size.width;
    size_t width = (size_t)targetWidth;
    size_t height = (size_t)ceil(bounds.size.height * scale);
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef context = CGBitmapContextCreate(
        NULL, width, height, 8, 0, colorSpace,
        kCGImageAlphaNoneSkipLast
    );
    CGColorSpaceRelease(colorSpace);
    if (!context) return NULL;
    CGContextSetRGBFillColor(context, 1, 1, 1, 1);
    CGContextFillRect(context, CGRectMake(0, 0, width, height));
    CGContextSaveGState(context);
    CGContextScaleCTM(context, scale, scale);
    [page drawWithBox:kPDFDisplayBoxMediaBox toContext:context];
    CGContextRestoreGState(context);
    CGImageRef image = CGBitmapContextCreateImage(context);
    CGContextRelease(context);
    return image;
}

static NSString *APSVTRecognize(CGImageRef image, NSError **error) {
    VNRecognizeTextRequest *request = [[VNRecognizeTextRequest alloc] init];
    request.recognitionLevel = VNRequestTextRecognitionLevelAccurate;
    NSString *configuredLanguages = NSProcessInfo.processInfo.environment[@"APSVT_OCR_LANGS"];
    request.recognitionLanguages = configuredLanguages.length > 0
        ? [configuredLanguages componentsSeparatedByString:@","]
        : @[@"uk-UA", @"en-US"];
    request.usesLanguageCorrection = NO;
    request.automaticallyDetectsLanguage = NO;
    request.minimumTextHeight = 0.006;

    VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCGImage:image options:@{}];
    if (![handler performRequests:@[request] error:error]) return nil;

    NSArray<VNRecognizedTextObservation *> *observations =
        [request.results sortedArrayUsingComparator:^NSComparisonResult(
            VNRecognizedTextObservation *left,
            VNRecognizedTextObservation *right
        ) {
            CGFloat rowDifference = CGRectGetMidY(left.boundingBox) - CGRectGetMidY(right.boundingBox);
            if (fabs(rowDifference) > 0.012) {
                return rowDifference > 0 ? NSOrderedAscending : NSOrderedDescending;
            }
            CGFloat columnDifference = CGRectGetMinX(left.boundingBox) - CGRectGetMinX(right.boundingBox);
            return columnDifference < 0 ? NSOrderedAscending : NSOrderedDescending;
        }];

    NSMutableArray<NSString *> *lines = [NSMutableArray array];
    for (VNRecognizedTextObservation *observation in observations) {
        VNRecognizedText *candidate = [[observation topCandidates:1] firstObject];
        if (candidate.string.length > 0) [lines addObject:candidate.string];
    }
    return [lines componentsJoinedByString:@"\n"];
}

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        if (argc < 3) {
            fprintf(stderr, "Usage: ocr-admissions <pdf> <output.ndjson> [start-page] [end-page]\n");
            return 2;
        }

        NSString *pdfPath = [NSString stringWithUTF8String:argv[1]];
        NSString *outputPath = [NSString stringWithUTF8String:argv[2]];
        PDFDocument *document = [[PDFDocument alloc] initWithURL:[NSURL fileURLWithPath:pdfPath]];
        if (!document) {
            fprintf(stderr, "Could not open %s\n", argv[1]);
            return 3;
        }
        if ([NSProcessInfo.processInfo.environment[@"APSVT_OCR_LIST"] boolValue]) {
            VNRecognizeTextRequest *request = [[VNRecognizeTextRequest alloc] init];
            request.recognitionLevel = VNRequestTextRecognitionLevelAccurate;
            NSError *languageError = nil;
            NSArray<NSString *> *languages = [request supportedRecognitionLanguagesAndReturnError:&languageError];
            fprintf(stderr, "Languages: %s\n", [[languages componentsJoinedByString:@","] UTF8String]);
            if (languageError) fprintf(stderr, "Language error: %s\n", languageError.localizedDescription.UTF8String);
        }

        NSInteger startPage = argc > 3 ? MAX(1, atoi(argv[3])) : 1;
        NSInteger endPage = argc > 4 ? MIN(document.pageCount, atoi(argv[4])) : document.pageCount;
        NSFileManager *files = NSFileManager.defaultManager;
        if (![files fileExistsAtPath:outputPath]) [files createFileAtPath:outputPath contents:nil attributes:nil];
        NSFileHandle *output = [NSFileHandle fileHandleForWritingAtPath:outputPath];
        [output seekToEndOfFile];

        for (NSInteger pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
            @autoreleasepool {
                PDFPage *page = [document pageAtIndex:pageNumber - 1];
                CGImageRef image = APSVTRenderPage(page, 1800);
                if (!image) {
                    fprintf(stderr, "Skipped %s page %ld: render failed\n", pdfPath.lastPathComponent.UTF8String, pageNumber);
                    continue;
                }
                NSError *recognitionError = nil;
                NSString *text = APSVTRecognize(image, &recognitionError);
                CGImageRelease(image);
                if (!text) {
                    fprintf(stderr, "Skipped %s page %ld: %s\n", pdfPath.lastPathComponent.UTF8String, pageNumber, recognitionError.localizedDescription.UTF8String);
                    continue;
                }
                NSDictionary *record = @{
                    @"file": pdfPath.lastPathComponent,
                    @"page": @(pageNumber),
                    @"text": text
                };
                NSError *jsonError = nil;
                NSData *json = [NSJSONSerialization dataWithJSONObject:record options:0 error:&jsonError];
                if (!json) {
                    fprintf(stderr, "Skipped %s page %ld: %s\n", pdfPath.lastPathComponent.UTF8String, pageNumber, jsonError.localizedDescription.UTF8String);
                    continue;
                }
                [output writeData:json];
                [output writeData:[NSData dataWithBytes:"\n" length:1]];
                fprintf(stderr, "OCR %s %ld/%ld\n", pdfPath.lastPathComponent.UTF8String, pageNumber, endPage);
            }
        }
        [output closeFile];
    }
    return 0;
}
