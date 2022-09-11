const getDoctors = 'SELECT * FROM doctors';

const getSingleDoctor = 'SELECT * FROM doctors WHERE doctor_id = $1';

const addDoctor = 'INSERT INTO doctors(user_id, firstname, lastname, specialist, image, active) VALUES ($1, $2, $3, $4, $5, $6)';

const updateDoctor = 'UPDATE doctors SET firstname = $1, lastname = $2 , specialist = $3 , image = $4, active = $5 where doctor_id = $6';

const deleteDoctor = 'DELETE FROM doctors WHERE doctor_id = $1';

export default { getDoctors, addDoctor, getSingleDoctor, updateDoctor, deleteDoctor };