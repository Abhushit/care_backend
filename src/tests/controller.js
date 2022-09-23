import queries from "./queries.js";
import pool from "../../db.js";

const getTests = (req, res) => {
  pool.query(queries.getTests, (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
  });
};

const getSingleTest = (req, res) => {
  const id = req.params.id;

  pool.query(queries.getSingleTest, [id], (err, result) => {
    if (err) throw err;
    const noTestFound = !result.rows.length;
    if (noTestFound) {
      res.json({
        msg: "Test not found!",
      });
    } else {
      res.status(200).json({
        msg: "Text Selected Successfully",
        data: result.rows,
      });
    }
  });
};

const addTest = (req, res) => {
  console.log("body", req.body);
  console.log('files', req.files);
  let allTestlist = [];

  const { user_id, testname, active, subtestname, unit, reference_range } =
    req.body;

  if (subtestname) {
    allTestlist = subtestname.map((test, index) => {
      return {
        subtestname: test,
        unit: unit[index],
        reference_range: reference_range[index],
      };
    });
  }

  console.log('allTestlist',allTestlist);

  pool.query(
    queries.addTest,
    [
      user_id,
      testname,
      active,
      allTestlist.map((test) => [
        test.subtestname,
        test.unit,
        test.reference_range,
      ]),
    ],
    (err, result) => {
      if (err) throw err;
      res.status(200).json({
        msg: "Test added successfully!",
      });
    }
  );
};

const updateTest = (req, res) => {
  console.log("body edit", req.body);
  console.log('files edit', req.files);

  const id = req.params.id;

  let testData = {
    user_id: "",
    testname: "",
    active: false,
    subtestname: [],
    unit: [],
    reference_range: [],
    testList: [],
  };

  pool.query(queries.getSingleTest, [id], (err, result) => {
    const noTestFound = !result.rows.length;
    if (noTestFound) {
      res.json({
        msg: "Test no found!",
      });
    } else {
      if (req.body.subtestname) {
        if (typeof req.body.subtestname == "string") {
          testData.testList = [
            {
              subtestname: req.body.subtestname,
              unit: req.body.unit,
              reference_range: req.body.reference_range,
            },
          ];
        } else {
          testData.testList = req.body.subtestname.map((test, index) => {
            return {
              subtestname: test,
              unit: req.body.unit[index],
              reference_range: req.body.reference_range[index],
            };
          });
        }
      } else {
        if (result.rows[0].testList) {
          testData.testList = result.rows[0].testList.map((test, index) => {
            return {
              subtestname: test[0],
              unit: test[1],
              reference_range: test[2],
            };
          });
        } else {
          testData.testList = [];
        }
      }

      testData.user_id = req.body.user_id
        ? req.body.user_id
        : result.rows[0].user_id;
      testData.testname = req.body.testname
        ? req.body.testname
        : result.rows[0].testname;
      testData.active = req.body.active
        ? req.body.active
        : result.rows[0].active;

      setTimeout(() => {
        pool.query(
          queries.updateTest,
          [
            testData.user_id,
            testData.testname,
            testData.active,
            testData.testList.map((test, index) => [
              test.subtestname,
              test.unit,
              test.reference_range,
            ]),
            id,
          ],
          (err, result2) => {
            if (err) throw err;
            res.status(200).json({
              msg: "Test updated Successfully!",
            });
          }
        );
      }, 500);
    }
  });
};

const deleteTest = (req, res) => {
  const id = req.params.id;

  pool.query(queries.getSingleTest, [id], (err, result) => {
    const noTestFound = !result.rows.length;
    if (noTestFound) {
      res.json({
        msg: "No Test found",
      });
    } else {
      pool.query(queries.deleteTest, [id], (err, result2) => {
        if (err) throw err;
        res.status(200).json({
          msg: "Test deleted successfully",
          test_id: id,
        });
      });
    }
  });
};

export default {
  getTests,
  getSingleTest,
  addTest,
  updateTest,
  deleteTest,
};
