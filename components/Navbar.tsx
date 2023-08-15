import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white text-black border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          CDMS
        </Link>

        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-gray-800">
              Customers
            </Link>
          </li>
          <li>
            <Link href="/new-customer" className="hover:text-gray-800">
            New Customer
            </Link>
          </li>
          <li>
            <span className="hover:text-gray-800 cursor-not-allowed">
                Soon...
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
