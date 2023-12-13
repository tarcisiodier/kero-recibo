import NavBar from "./Header";
import NewFormRecibo from "./newFormRecibo";
function App() {
    function getDate(){
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${month}-${date}-${year}`;
    }
    document.title = `Recibo-${getDate()}-${Date.now()}`;
  return (
      <>
        <NavBar />
          <NewFormRecibo />
      </>
  );
}

export default App;
