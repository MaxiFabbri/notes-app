import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotesPage from './pages/NotesPage.jsx';

function App() {
  return (
    <>
      <NotesPage />
      <ToastContainer position="bottom-right" autoClose={3500} theme="dark" limit={3} />
    </>
  );
}

export default App;
