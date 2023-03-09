// import package bawaan dari
const http = require("http");
const url = require("url");
// import package yang kita install
const mysql = require("mysql");

const host = "localhost";
const port = 3000;

const mydb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_dasar",
});

mydb.connect((err) => {
  if (err) throw err;
});

const requestListener = (req, res) => {
  //
  const path_name = url.parse(req.url).pathname;
  switch (path_name) {
    case "/":
      console.log("Welcome the backend");
      res.writeHead(200);
      res.end("Backend website Sekolah");
      break;

    case "/get_siswa":
      console.log("HIT API get_siswa");
      var queryGetSiswa = "SELECT * FROM siswa";
      const queryParam = url.parse(req.url, true).query;
      if ("nisn" in queryParam) {
        queryGetSiswa += ` WHERE nisn = ${mysql.escape(queryParam.nisn)}`;
      }

      mydb.query(queryGetSiswa, (err, result, fields) => {
        if (err) throw err;

        const responsePayload = {
          description: "Berhasil mendapatkan data siswa",
          data: result,
        };

        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(responsePayload));
      });
      break;

    case "/insert_siswa":
      console.log("HIT API /insert_siswa");
      var bodyInsert = [];
      req
        .on("data", (chunk) => {
          bodyInsert.push(chunk);
        })
        .on("end", () => {
          bodyInsert = JSON.parse(Buffer.concat(bodyInsert).toString());
          const nisn = bodyInsert.nisn;
          const alamat = bodyInsert.alamat;
          const nama_siswa = bodyInsert.nama_siswa;

          const queryInsert =
            "INSERT INTO siswa (nisn, nama_siswa, alamat) VALUES(?,?,?)";
          const valueInsert = [nisn, nama_siswa, alamat];
          mydb.query(queryInsert, valueInsert, (err, result, fields) => {
            if (err) throw err;

            console.log(result);

            const responsePayload = {
              description: "Berhasil insert data siswa",
              data: result,
            };
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(responsePayload));
          });
        });
      break;

    case "/update_siswa":
      console.log("HIT API /update_siswa");
      let dataUpdate = [];
      req
        .on("data", (chunk) => {
          dataUpdate.push(chunk);
        })
        .on("end", () => {
          dataUpdate = JSON.parse(Buffer.concat(dataUpdate).toString());
          const { id } = url.parse(req.url, true).query;
          var queryUpdate = `UPDATE siswa SET`;
          if ("nisn" in dataUpdate) {
            queryUpdate += ` nisn = ${mysql.escape(dataUpdate.nisn)}`;
          }
          if ("nama_siswa" in dataUpdate) {
            queryUpdate += `, nama_siswa = ${mysql.escape(
              dataUpdate.nama_siswa
            )}`;
          }
          if ("alamat" in dataUpdate) {
            queryUpdate += `, alamat = ${mysql.escape(dataUpdate.alamat)}`;
          }
          queryUpdate += ` WHERE id = ${mysql.escape(id)}`;
          mydb.query(queryUpdate, (err, result, fields) => {
            if (err) throw err;
            console.log(result);

            const responsePayload = {
              description: "Berhasil update data siswa",
              data: result,
            };

            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(responsePayload));
          });
        });
      break;

    case "/delete_siswa":
      console.log("HIT API /delete_siswa");
      const queryParamDelete = url.parse(req.url, true).query;
      var queryDelete = `DELETE FROM siswa where id = ${mysql.escape(
        queryParamDelete.id
      )}`;
      let responsePayload = {};
      mydb.query(queryDelete, (err, result, fields) => {
        if (err) throw err;
        responsePayload = {
          description: "Berhasil delete data siswa",
          data: result,
        };
      });
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(responsePayload));
      break;

    default:
      console.log(req.url);
      res.writeHead(404);
      res.end(
        JSON.stringify({
          error: "Not Found",
        })
      );
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server running on: http://${host}:${port}`);
});
