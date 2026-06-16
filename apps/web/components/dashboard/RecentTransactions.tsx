"use client";

export default function RecentTransactions() {
  const items = [
    { id: 1, date: "2026-06-10", desc: "Grocery Store", amount: "-₹1,250" },
    { id: 2, date: "2026-06-09", desc: "Salary", amount: "+₹50,000" },
    { id: 3, date: "2026-06-07", desc: "Coffee", amount: "-₹180" },
    { id: 4, date: "2026-06-05", desc: "Subscription", amount: "-₹499" },
  ];

  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Recent Transactions</h3>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full table-auto">
          <thead className="bg-zinc-100 text-left text-sm text-zinc-600">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="px-4 py-3">{it.date}</td>
                <td className="px-4 py-3">{it.desc}</td>
                <td className="px-4 py-3">{it.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
