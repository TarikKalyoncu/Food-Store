import { NextFunction, Request, Response, Router } from "express";
import { sample_foods, sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";
import multer from 'multer'; 

import path from 'path';




const express = require("express");
const app = express();

const router = Router();

// CORS middleware

// Diğer middleware'ler ve yönlendiriciler






router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    console.log("merhaba");
    const foodsCount = await FoodModel.countDocuments();

    if (foodsCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await FoodModel.create(sample_foods);
    res.send("Seed Is Done!");
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
  })
);

router.get(
  "/dash",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
    console.log("selamlar");
  })
);

router.get(
  "/search/:searchTerm",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

router.get(
  "/tags",
  asyncHandler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "All",
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);
    res.send(tags);
  })
);

router.get(
  "/tag/:tagName",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find({ tags: req.params.tagName });
    res.send(foods);
  })
);

router.get(
  "/:foodId",
  asyncHandler(async (req, res) => {
    const food = await FoodModel.findById(req.params.foodId);
    res.send(food);
  })
);

router.post(
  "/dash/products",
  asyncHandler(async (req, res) => {
    console.log(2);
    const { name, tags, favorite, cookTime, origins, price, imageUrl } =
      req.body;

    const newFood = new FoodModel({
      name,
      tags,
      favorite,
  
      cookTime, 
      origins,
      price,
      imageUrl,
    });

    try {
      const dbFood = await newFood.save();
      res.status(201).json(dbFood);
    } catch (err) {
      console.error("Kullanıcı kaydetme hatası:", err);
      res
        .status(500)
        .json({ message: "Kullanıcı kaydedilirken bir hata oluştu" });
    }
  })
);






router.put(
  "/dash/products/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params; // Güncellenecek ürünün ID'sini alın

    const { name, tags, favorite, stars, cookTime, origins, price, imageUrl } =
      req.body;

    try {
      // Güncellenecek ürünü veritabanından bulun
      const updatedFood = await FoodModel.findByIdAndUpdate(
        id,
        {
          name,
          tags,
          favorite,
          cookTime,
          origins,
          price,
          imageUrl,
        },
        { new: true } // Yeni güncellenmiş veriyi döndürmek için {new: true} seçeneğini kullanın
      );

      

      res.status(200).json(updatedFood);
    } catch (err) {
      console.error("Ürün güncelleme hatası:", err);
      res.status(500).json({ message: "Ürün güncellenirken bir hata oluştu" });
    }
  })
);

const uploadDir = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Dosya yükleme endpoint'i
router.post('/dash/products', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Burada dosyanın yüklendiği yolu ve adını kullanarak dosyanın tam URL'sini oluşturun
  const fileUrl = `http://localhost:5000//dash/products/${req.file.filename}`;

  return res.status(200).json({ url: fileUrl });
});

// Statik dosyaları sunmak için uploads klasörünü istemcilere açın
app.use('/dash/products', express.static(uploadDir));

export default router;





