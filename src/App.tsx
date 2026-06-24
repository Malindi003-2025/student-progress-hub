import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dvtmqrtbnbnuzwteqeya.supabase.co'
const supabaseKey = 'sb_publishable_rzidlatCKr8sgrNGH2vnyw_T0DuaSiV'
const supabase = createClient(supabaseUrl, supabaseKey)

type Grade = {
  id: number
  subject: string
  score: number
  grade: string
}

type Student = {
  id: number
  name: string
  admission_number: string
  class: string
  grades: Grade[]
}

function App() {
  const [admissionNo, setAdmissionNo] = useState('')
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchGrades = async () => {
    if (!admissionNo) return
    setLoading(true)
    setError('')
    setStudent(null)

    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('admission_number', admissionNo.trim())
      .single()

    if (studentError || !studentData) {
      setError('Admission number not found. Check with your admin.')
      setLoading(false)
      return
    }

    const { data: gradesData, error: gradesError } = await supabase
      .from('grades')
      .select('*')
      .eq('student_id', studentData.id)
      .order('subject', { ascending: true })

    if (gradesError) {
      setError('Could not load grades. Try again.')
      setLoading(false)
      return
    }

    setStudent({ ...studentData, grades: gradesData || [] })
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1>CHS Student Education Hub - 2026</h1>
      <p>Enter your Admission Number to view your progress</p>
      
      <div style={{ margin: '20px 0' }}>
        <input 
          type="text"
          placeholder="e.g. ISERC/040/2025"
          value={admissionNo}
          onChange={(e) => setAdmissionNo(e.target.value)}
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button 
          onClick={fetchGrades} 
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : 'Check Grades'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {student && (
        <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>Welcome, {student.name}</h2>
          <p><strong>Admission No:</strong> {student.admission_number}</p>
          <p><strong>Class:</strong> {student.class}</p>
          
          <h3>Your Grades</h3>
          {student.grades.length === 0 ? (
            <p>No grades uploaded yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Subject</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Score</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {student.grades.map((grade) => (
                  <tr key={grade.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{grade.subject}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{grade.score}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{grade.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default App
