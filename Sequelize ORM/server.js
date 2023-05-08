require("dotenv");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const Siswa = require("./Siswa");

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Server backend sudah berjalan");
  return res.status(200).json({
    success: true,
    message: "Server backend sudah berjalan",
  });
});

app.get("/siswa", async (req, res) => {
  console.log("HIT API GET /siswa");

  const { nisn } = req.query || [];
  const sqlOptions = {};

  if (nisn) {
    sqlOptions.where = {
      nisn,
    };
  }

  const siswa = await Siswa.findAll(sqlOptions);
  return res.status(200).json({
    status: "success",
    data: siswa,
  });
});

app.post("/siswa", async (req, res) => {
  console.log("HIT API /insert_siswa");
  const { nisn, alamat, nama_siswa } = req.body;

  const insertData = await Siswa.create({ nisn, alamat, nama_siswa });

  return res.status(200).json({
    status: "success",
    data: insertData,
  });
});

app.put("/siswa", async (req, res) => {
  console.log("HIT API /update_siswa");
  const { id } = req.query;
  const { nisn, nama_siswa, alamat } = req.body;

  const siswa = await Siswa.findByPk(id);
  if (!siswa) {
    return res.status(404).json({
      status: "fail",
      message: "id tidak ditemukan",
    });
  }

  siswa.update({
    nisn,
    nama_siswa,
    alamat,
  });

  return res.status(200).json({
    status: "success",
    data: siswa,
  });
});

app.delete("/siswa", async (req, res) => {
  console.log("HIT API /delete_siswa");
  const { id } = req.query;

  const siswa = await Siswa.findByPk(id);
  if (!siswa) {
    return res.status(404).json({
      status: "fail",
      message: "id tidak ditemukan",
    });
  }

  siswa.destroy();

  return res.status(200).json({
    status: "success",
    data: siswa,
  });
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
