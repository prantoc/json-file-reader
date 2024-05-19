const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const localesPath = path.join(__dirname, "../json-fiels");

// Function to read JSON files dynamically
const loadLocales = () => {
  const files = fs
    .readdirSync(localesPath)
    .filter((file) => file.endsWith(".json"));
  const languages = files.map((file) => path.basename(file, ".json"));
  const locales = {};

  languages.forEach((lang) => {
    const data = fs.readFileSync(path.join(localesPath, `${lang}.json`));
    locales[lang] = JSON.parse(data);
  });

  return locales;
};

router.get("/", (req, res) => {
  const locales = loadLocales();
  const categories = new Set();

  Object.values(locales).forEach((locale) => {
    Object.keys(locale).forEach((category) => {
      categories.add(category);
    });
  });

  res.render("index", { locales, categories: Array.from(categories) });
});

router.get("/keys", (req, res) => {
  const { category } = req.query;
  const locales = loadLocales();
  const keys = new Set();

  Object.values(locales).forEach((locale) => {
    if (locale[category]) {
      Object.keys(locale[category]).forEach((key) => {
        keys.add(key);
      });
    }
  });

  res.json(Array.from(keys));
});

router.post("/save", (req, res) => {
  const { category, key, ...values } = req.body;

  Object.keys(values).forEach((language) => {
    const filePath = path.join(localesPath, `${language}.json`);
    const data = JSON.parse(fs.readFileSync(filePath));

    if (!data[category]) {
      data[category] = {};
    }
    data[category][key] = values[language];

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  });

  res.redirect("/");
});

module.exports = router;
