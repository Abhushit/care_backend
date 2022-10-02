import pool from "./../../db.js";
import queries from "./queries.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { basename, dirname, join } from "path";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));

const getPatients = (req, res) => {
  pool.query(queries.getPatients, (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
  });
};

const getSinglePatient = (req, res) => {
  const id = req.params.id;

  pool.query(queries.getSinglePatient, [id], (err, result) => {
    if(err) throw err;
    const noPatientFound = !result.rows.length;
    if(noPatientFound){
      res.json({
        msg: "Patient does not exist!"
      })
    }else{
      res.status(200).json({
        msg:"Patient Selected Successfully",
        data: result.rows
      })
    }
  })
}

const addPatients = (req, res) => {
  // console.log("file", req.files);
  // console.log('req',req);
  console.log("body", req.body);

  const images = req.files.image;
  let currentImages = [];
  let allDocuments = [];
  // let allTests = [];
  const {
    doctor_id,
    user_id,
    firstname,
    lastname,
    dob,
    age,
    gender,
    phone1,
    phone2,
    address1,
    address2,
    email,
    country,
    district,
    pradesh,
    city,
    ward,
    doctor_notes,
    follow_up_dates,
    referred_by,
    transferred_to,
    // created_at,
    title,
    notes,
    active,
    tests,
    findings
  } = req.body;

  if(images){
    images.map((img) => {
    currentImages.push(`${process.env.ROOT_URL}/api/v1/images/${img.filename}`);
    });
  }

  if(title){
    allDocuments = title.map((val, index) => {
      return {
        title: val,
        notes: notes[index],
        image: currentImages[index],
      };
    });
  }


  //   console.log("current images", currentImages);
  // console.log("all documents", allDocuments);

  pool.query(
    queries.addPatients,
    [
      doctor_id,
      user_id,
      firstname,
      lastname,
      dob,
      age,
      gender,
      phone1,
      phone2,
      address1,
      address2,
      email,
      country,
      district,
      pradesh,
      city,
      ward,
      doctor_notes,
      follow_up_dates,
      referred_by,
      transferred_to,
      // created_at,
      new Date(),
      active,
      tests,
      findings,
      allDocuments.map(docs => [
        docs.title, docs.notes, docs.image
    ]),
    ],
    (err, result) => {
      if (err) throw err;
      res.status(200).json({
        msg: "Patient Added Successfully!",
      });
    }
  );
};

const updatePatient = (req, res) => {
  console.log('patient update body', req.body);
  const id = req.params.id;
  const images = req.files.image;
  var newImages, oldImages;

  

  let patientData = {
    patient_id: "",
    doctor_id: "",
    user_id: "",
    firstname: "",
    lastname: "",
    dob: "",
    age: "",
    gender: "",
    phone1: "",
    phone2:"",
    address1: "",
    address2: "",
    email: "",
    country: "",
    district: "",
    pradesh: "",
    city: "",
    ward: "",
    doctor_notes: "",
    follow_up_dates: "",
    referred_by: "",
    transferred_to: "",
    updated_at: "",
    active: true,
    findings: [],
    tests: [],
    documents: [],
    title: [],
    notes: [],
  }

  pool.query(queries.getSinglePatient, [id], (err, result) => {
    const noPatientFound = !result.rows.length;
    if(noPatientFound){
      res.json({
        msg: "Patient does not exist",
      })
    }else{
      console.log('result rows >>>', result.rows[0]);
      if(images){
        newImages = images.map(img => {
          return `${process.env.ROOT_URL}/api/v1/images/${img.filename}`;
        });
        if(result.rows[0].documents){
          oldImages = result.rows[0].documents.map((data, index) => {
            return `${process.env.ROOT_URL}/api/v1/images/${data[2]}`
          })
        }else{
          oldImages = ""
        }
      }else{
        if(result.rows[0].documents){
          newImages = result.rows[0].documents.map((data, index) => {
            return `${process.env.ROOT_URL}/api/v1/images/${data[2]}`
          })
        }else{
          newImages = "";
        }
        oldImages = "";
      }

      // console.log('body>>>', req.body);
      patientData.patient_id = id;
      patientData.doctor_id = req.body.doctor_id ? req.body.doctor_id : result.rows[0].doctor_id;
      patientData.user_id = req.body.user_id ? req.body.user_id : result.rows[0].user_id; 
      patientData.firstname = req.body.firstname ? req.body.firstname : result.rows[0].firstname; 
      patientData.lastname = req.body.lastname ? req.body.lastname : result.rows[0].lastname; 
      patientData.dob = req.body.dob ? req.body.dob : result.rows[0].dob; 
      patientData.age = req.body.age ? req.body.age : result.rows[0].age; 
      patientData.gender = req.body.gender ? req.body.gender : result.rows[0].gender; 
      patientData.phone1 = req.body.phone1 ? req.body.phone1 : result.rows[0].phone1; 
      patientData.phone2 = req.body.phone2 ? req.body.phone2 : result.rows[0].phone2; 
      patientData.address1 = req.body.address1 ? req.body.address1 : result.rows[0].address1; 
      patientData.address2 = req.body.address2 ? req.body.address2 : result.rows[0].address2; 
      patientData.email = req.body.email ? req.body.email : result.rows[0].email; 
      patientData.country = req.body.country ? req.body.country : result.rows[0].country ; 
      patientData.district = req.body.district ? req.body.district : result.rows[0].district; 
      patientData.pradesh = req.body.pradesh ? req.body.pradesh : result.rows[0].pradesh; 
      patientData.city = req.body.city ? req.body.city : result.rows[0].city; 
      patientData.ward = req.body.ward ? req.body.ward : result.rows[0].ward; 
      patientData.doctor_notes = req.body.doctor_notes ? req.body.doctor_notes : result.rows[0].doctor_notes; 
      patientData.follow_up_dates = req.body.follow_up_dates ? req.body.follow_up_dates : result.rows[0].follow_up_dates; 
      patientData.referred_by = req.body.referred_by ? req.body.referred_by : result.rows[0].referred_by; 
      patientData.transferred_to = req.body.transferred_to ? req.body.transferred_to : result.rows[0].transferred_to; 
      patientData.active = req.body.active ? req.body.active : result.rows[0].active; 
      patientData.findings = req.body.findings ? req.body.findings : result.rows[0].findings; 
      patientData.tests = req.body.tests ? req.body.tests : result.rows[0].tests; 
      patientData.updated_at = new Date(); 
      
      if(req.body.title){
        if(typeof(req.body.title) == "string"){
          patientData.documents = [{
            title: req.body.title,
            notes: req.body.notes,
            image: newImages[0],
          }]
        }else{
          patientData.documents = req.body.title.map((data,index) => {
            return {
              title: data,
              notes: req.body.notes[index],
              image: newImages[index]
            }
          })
        }
      }else{
        if(result.rows[0].documents){
          patientData.documents = result.rows[0].documents.map((data,index) => {
            return {
              title: data[0],
              notes: data[1],
              images: data[2]
            }
          })
        }else{
          patientData.documents = [];
        }
        
      }

      // console.log('patient data', patientData);
      // console.log('new imgs', newImages);
      // console.log('old imsg', oldImages);
      setTimeout(() => {
        pool.query(queries.updatePatient,[
          patientData.doctor_id,
          patientData.user_id,
          patientData.firstname,
          patientData.lastname,
          patientData.dob,
          patientData.age,
          patientData.gender,
          patientData.phone1,
          patientData.phone2,
          patientData.address1,
          patientData.address2,
          patientData.email,
          patientData.country,
          patientData.district,
          patientData.pradesh,
          patientData.city,
          patientData.ward,
          patientData.doctor_notes,
          patientData.follow_up_dates,
          patientData.referred_by,
          patientData.transferred_to,
          patientData.updated_at,
          patientData.active,
          patientData.tests,
          patientData.findings,
          patientData.documents.map(doc => [
            doc.title, doc.notes, doc.image
          ]),
          patientData.patient_id,
        ],
          (err,result) => {
            if(oldImages){
              oldImages.map((oldImg, index) => {
                var oldPath = path.join(path.resolve("./", oldImg, oldImg.split("/").pop()));
                if (fs.existsSync(oldPath)) {
                  fs.unlink(oldPath, (err) => {
                    if (err) throw err;
                  });
                }
              })
            }
            res.status(200).json({
              msg: "Patient updated successfully!",
              patient_id: id
            })
          })
      },500)

    }
  })

}

const updateFindings = (req,res) => {
  console.log('req findings >>>', req.body);

  const { findings } = req.body;
  const id = req.params.id;

  pool.query(queries.updateFindings, [
    findings.map(find => find.map(fi => [fi])), id
  ], (err, result) => {
    if (err) throw err;
    res.status(200).json({
      msg:"Patient Report Updated Successfully",
    })
  })

}

const deletePatient = (req, res) => {
  const id = req.params.id;

  pool.query(queries.getSinglePatient, [id], (err, result) => {
    const noPatientFound = !result.rows.length;
    if(noPatientFound){
      res.json({
        msg: "Patient not found"
      })
    }else{
      pool.query(queries.deletePatient,[id], (err, result) => {
        if(err) throw err;
        res.status(200).json({
          msg: "Patient deleted Successfully",
          patient_id: id
        })
      })
    }
  })
}

export default {
  getPatients,
  addPatients,
  deletePatient,
  updatePatient,
  getSinglePatient,
  updateFindings
};
