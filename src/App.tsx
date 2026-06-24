import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dvtmrqtbnbnuzwteqeya.supabase.co'
const supabaseKey = 'sb_publishable_rzid1atCKr8sgrNGH2vnyw_T0DuaSiV'
const supabase = createClient(supabaseUrl, supabaseKey)

type Grade = {
  id: number
  student_id: string
  student_name: string
  course_code: string
  course_name: string
  grade: string
  semester: string
  year: number
}

function App() {
  const [admissionNo, setAdmissionNo] = useState('')
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchGrades = async () => {
    if (!admissionNo.trim()) {
      setError('Please enter an admission number')
      return
    }

    setLoading(true)
    setError('')
    setGrades([])

    const { data: gradesData, error: gradesError } = await supabase
     .from('grades')
     .select('*')
     .ilike('student_id', admissionNo.trim())

    if (gradesError ||!gradesData || gradesData.length === 0) {
      setError('Admission number not found. Check with your admin.')
      setLoading(false)
      return
    }

    setGrades(gradesData)
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Student Progress Hub</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={admissionNo}
          onChange={(e) => setAdmissionNo(e.target.value)}
          placeholder="Enter Admission Number"
          style={{ padding: '8px', marginRight: '10px' }}
          onKeyDown={(e) => e.key === 'Enter' && fetchGrades()}
        />
        <button onClick={fetchGrades} disabled={loading}>
          {loading? 'Searching...' : 'Check Grades'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {grades.length > 0 && (
        <div>
          <h2>Results for: {grades[0].student_name}</h2>
          <h3>Admission No: {grades[0].student_id}</h3>

          <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Grade</th>
                <th>Semester</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.course_code}</td>
                  <td>{grade.course_name}</td>
                  <td><strong>{grade.grade}</strong></td>
                  <td>{grade.semester}</td>
                  <td>{grade.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App
