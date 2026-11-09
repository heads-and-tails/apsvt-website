-- Move the secretary after the three existing council representatives.
-- Preserve the profile, all other entries, and any later editorial reordering.
update public.editorial_content_items
set sort_order = 50,
    updated_at = now()
where id = '3a5e3f9c-3c69-4b22-b57d-7e4f17e314a9'
  and kind = 'research_resource'
  and payload->>'pagePath' = '/students/council'
  and payload->>'sectionId' = 'representation'
  and payload->>'entryType' = 'section'
  and payload->>'title' = 'МОРОКА ДАРИНА'
  and sort_order = 10;
