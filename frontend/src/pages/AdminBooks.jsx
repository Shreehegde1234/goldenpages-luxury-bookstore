import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminBooks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // New book state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', author: '', description: '', price: '', category: '', image: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchBooks();
  }, [user, navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/books');
      setBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/books', formData, config);
      setShowAddForm(false);
      setFormData({ title: '', author: '', description: '', price: '', category: '', image: '' });
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error executing insertion');
    }
  };

  if (loading) return <div className="text-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-secondary rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
       <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-6 mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-serif text-primary mb-2">Catalog Operations</h1>
          <p className="text-gray-500 font-light text-sm uppercase tracking-widest">Master Inventory Database</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-8 py-3 rounded-sm font-bold tracking-widest text-xs uppercase transition-colors shadow-sm ${showAddForm ? 'bg-primary text-white hover:bg-gray-800' : 'bg-secondary text-primary hover:bg-white border border-secondary hover:border-primary'}`}
        >
          {showAddForm ? 'Cancel Operation' : 'Curate New Volume'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-10 rounded-sm shadow-luxury border border-gray-100 mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
          <h2 className="text-2xl font-serif text-primary mb-8 pb-4 border-b border-gray-100">Initialize New Subject</h2>
          <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Title of Work</label>
              <input required type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Masterpiece title..." />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Author Name</label>
              <input required type="text" className="input-field" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="First Last" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Literary Classification</label>
              <input required type="text" className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Fiction, Classics" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Monetary Valuation (₹)</label>
              <input required type="number" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="299.00" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Cover Artwork Architecture (URL)</label>
              <input type="text" className="input-field font-mono text-xs" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Literary Synopsis</label>
              <textarea required rows="4" className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Provide a compelling overview..."></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="btn-primary py-4 px-12 uppercase tracking-widest text-xs">Execute Insertion</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Manuscript</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Author</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Classification</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Valuation</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-gray-50 border border-gray-200 p-1 flex items-center justify-center shrink-0">
                        <img src={book.image || '/placeholder.png'} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-serif font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2 max-w-[300px]">{book.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-light text-sm">{book.author}</td>
                  <td className="px-6 py-4">
                     <span className="bg-gray-100 text-gray-600 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm border border-gray-200">
                       {book.category}
                     </span>
                  </td>
                  <td className="px-6 py-4 font-serif font-bold text-primary text-lg text-right">₹{book.price}</td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr><td colSpan="4" className="p-12 text-center text-gray-500 font-light italic">The inventory repository is currently desolate.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBooks;
