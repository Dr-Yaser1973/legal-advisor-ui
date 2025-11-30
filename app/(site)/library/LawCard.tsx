"use client";

import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default function LawCard({ doc }: { doc: any }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-bold text-right mb-2">{doc.title}</h2>

      <div className="flex justify-between">
        <div className="text-gray-600 text-sm">
          {doc.jurisdiction} • {doc.category}
        </div>

        <DeleteButton id={doc.id} />
      </div>

      <Link
        href={`/library/${doc.id}`}
        className="block text-blue-600 text-right mt-3 hover:underline"
      >
        قراءة القانون →
      </Link>
    </div>
  );
}

