import RecintoFerial from './components/RecintoFerial'

function App() {
  const handleFinalize = (recinto) => {
    console.log('Recinto finalizado:', recinto)
  }

  return (
    <div className="h-screen w-screen">
      <RecintoFerial onFinalize={handleFinalize} />
    </div>
  )
}

export default App
