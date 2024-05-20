const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const jsonsPath = path.join(__dirname, "../json-files");

// Function to read JSON files dynamically
const loadJson = () => {
  const files = fs
    .readdirSync(jsonsPath)
    .filter((file) => file.endsWith(".json"));
  const languages = files.map((file) => path.basename(file, ".json"));
  const jsons = {};

  languages.forEach((lang) => {
    const data = fs.readFileSync(path.join(jsonsPath, `${lang}.json`));
    jsons[lang] = JSON.parse(data);
  });

  return jsons;
};

router.get("/", (req, res) => {
  const jsons = loadJson();
  const categories = new Set();

  Object.values(jsons).forEach((json) => {
    Object.keys(json).forEach((category) => {
      categories.add(category);
    });
  });

  res.render("index", { jsons, categories: Array.from(categories) });
});

router.get("/keys", (req, res) => {
  const { category } = req.query;
  const jsons = loadJson();
  const keys = new Set();

  Object.values(jsons).forEach((json) => {
    if (json[category]) {
      Object.keys(json[category]).forEach((key) => {
        keys.add(key);
      });
    }
  });

  res.json(Array.from(keys));
});

router.post("/save", (req, res) => {
  const { categories, newCategories, ...values } = req.body;

  if (categories) {
    categories.forEach(({ category, key }) => {
      Object.keys(values).forEach((language) => {
        const filePath = path.join(jsonsPath, `${language}.json`);
        const data = JSON.parse(fs.readFileSync(filePath));

        if (!data[category]) {
          data[category] = {};
        }
        data[category][key] = values[language];

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      });
    });
  }

  if (newCategories) {
    newCategories.forEach(({ category, key }) => {
      Object.keys(values).forEach((language) => {
        const filePath = path.join(jsonsPath, `${language}.json`);
        const data = JSON.parse(fs.readFileSync(filePath));

        if (!data[category]) {
          data[category] = {};
        }
        data[category][key] = key.charAt(0).toUpperCase() + key.slice(1);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      });
    });
  }

  res.redirect("/");
});

module.exports = router;
