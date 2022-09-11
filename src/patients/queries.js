const getPatients = 'SELECT * FROM patients';

const getSinglePatient = 'SELECT * FROM patients where patient_id = $1';

const addPatients = 'INSERT INTO patients(doctor_id, user_id, firstname, lastname, dob, age, gender, phone1, phone2, address1, address2, email, country, district, pradesh , doctor_notes, follow_up_dates, referred_by, transferred_to, created_at, documents) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)';

const deletePatient = 'DELETE FROM patients WHERE patient_id = $1';

const updatePatient = 'UPDATE patients SET doctor_id = $1, user_id = $2, firstname = $3, lastname = $4, dob = $5, age = $6, gender = $7, phone1 = $8, phone2 = $9, address1 = $10, address2 = $11, email = $12, country = $13, district = $14, pradesh = $15 , doctor_notes = $16, follow_up_dates = $17, referred_by = $18, transferred_to = $19, updated_at = $20, documents = $21 WHERE patient_id = $22';

export default {
    getPatients, addPatients, updatePatient, deletePatient , getSinglePatient
}