const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = 3000;

const mydb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_dasar",
});

mydb.connect((err) => {
  if (err) throw err;
});

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Server backend sudah berjalan");
  return res.status(200).json({
    success: true,
    message: "Server backend sudah berjalan",
  });
});

app.get("/get_siswa", (req, res) => {
  console.log("HIT API GET /get_siswa");
  var queryGetSiswa = "SELECT * FROM siswa";
  const { nisn } = req.query;
  if (nisn) queryGetSiswa += ` WHERE nisn = ${mysql.escape(nisn)}`;

  mydb.query(queryGetSiswa, (err, result) => {
    if (err) throw err;

    const responsePayload = {
      description: "Berhasil mendapatkan data siswa",
      data: result,
    };

    return res.status(200).json(responsePayload);
  });
});

app.post("/insert_siswa", (req, res) => {
  console.log("HIT API /insert_siswa");
  const { nisn, alamat, nama_siswa } = req.body;
  const queryInsert =
    "INSERT INTO siswa (nisn, nama_siswa, alamat) VALUES(?,?,?)";
  const valueInsert = [nisn, nama_siswa, alamat];

  mydb.query(queryInsert, valueInsert, (err, result, fields) => {
    if (err) throw err;

    const responsePayload = {
      description: "Berhasil insert data siswa",
      data: result,
    };
    return res.status(200).json(responsePayload);
  });
});

app.put("/update_siswa", (req, res) => {
  console.log("HIT API /update_siswa");
  const { id } = req.query;
  const { nisn, nama_siswa, alamat } = req.body;
  
  var queryUpdate = `UPDATE siswa SET`;
  if (nisn) queryUpdate += ` nisn = ${mysql.escape(nisn)}`;
  if (nama_siswa) queryUpdate += ` , nama_siswa = ${mysql.escape(nama_siswa)}`;
  if (alamat) queryUpdate += ` , alamat = ${mysql.escape(alamat)}`;

  queryUpdate += ` WHERE  id = ${mysql.escape(id)}`;
  mydb.query(queryUpdate, (err, result, fields) => {
    if (err) throw err;
    console.log(result);

    const responsePayload = {
      description: "Berhasil update data siswa",
      data: result,
    };

    return res.status(200).json(responsePayload);
  });
});

app.delete("/delete_siswa", (req, res) => {
  console.log("HIT API /delete_siswa");
  const { id } = req.query;
  var queryDelete = `DELETE FROM siswa where id = ${mysql.escape(id)}`;

  mydb.query(queryDelete, (err, result) => {
    if (err) throw err;
    responsePayload = {
      description: "Berhasil delete data siswa",
      data: result,
    };

    return res.status(200).json(responsePayload);
  });
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
