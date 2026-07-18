(() => {
  const issues = {
    "/materials/visnyk-1-2-2020-50b2542a1.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_1-2_2020.pdf",
    "/materials/visnyk-3-4-2020-5ac217cef.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_3-4_2020.pdf",
    "/materials/visnyk-1-2019-e0ba72738.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_1_2019.pdf",
    "/materials/visnyk-2-2019-643fbc683.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_2_2019.pdf",
    "/materials/visnyk-3-2019-665fcaf31.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_3_2019.pdf",
    "/materials/visnyk-4-2019-012fd0cbb.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_4_2019.pdf",
    "/materials/visnyk-2-2018-c27f342ff.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_2_2018.pdf",
    "/materials/visnyk-3-2018-0ecc8ab18.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_3_2018.pdf",
    "/materials/visnyk-4-2018-d95ccb926.html": "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_4_2018.pdf"
  };
  const target = issues[location.pathname] || "/research/journals";
  const link = document.getElementById("visnyk-link");
  if (link) link.href = target;
  location.replace(target);
})();
