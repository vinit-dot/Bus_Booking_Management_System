import Layout from '../components/common/Layout';
import SearchForm from '../components/home/SearchForm';

export default function SearchPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Search Buses</h1>
          <p className="text-gray-500 mb-6">Enter your travel details to find available buses</p>
          <SearchForm />
        </div>
      </div>
    </Layout>
  );
}
