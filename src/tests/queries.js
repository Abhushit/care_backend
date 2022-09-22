const getTests = 'SELECT * FROM tests';

const getSingleTest = 'SELECT * FROM tests where test_id = $1';

const addTest = 'INSERT INTO tests(user_id, testname, active, testlist) VALUES($1, $2, $3, $4)';

const updateTest = 'UPDATE tests SET user_id = $1 , testname = $2, active = $3, testlist = $4 WHERE test_id = $5';

const deleteTest = 'DELETE FROM tests WHERE test_id = $1';

export default {
    getTests,
    getSingleTest,
    addTest,
    updateTest,
    deleteTest
}