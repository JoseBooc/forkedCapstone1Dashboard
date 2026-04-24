import React from 'react';
import { useForm } from '@inertiajs/react';

type OpportunityForm = {
  job_title: string;
  company_name: string;
  type: 'Job' | 'Internship';
  location: string;
  work_type: string;
  modality: 'Remote' | 'Hybrid' | 'On-site';
  date_from: string;
  date_to: string;
  posting_date: string;
  quantity: number | '';
  salary_range_from: number | '';
  salary_range_to: number | '';
  description: string;
};

export default function PostOpportunity() {
  const { data, setData, post, processing, errors, reset } = useForm<OpportunityForm>({
    job_title: '',
    company_name: '',
    type: 'Job',
    location: '',
    work_type: '',
    modality: 'On-site',
    date_from: '',
    date_to: '',
    posting_date: '',
    quantity: '',
    salary_range_from: '',
    salary_range_to: '',
    description: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/api/jobs', {
      preserveScroll: true,
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post Opportunity</h1>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2">Job Title *</label>
          <input
            type="text"
            required
            value={data.job_title}
            onChange={(e) => setData('job_title', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.job_title && <p className="text-red-600 text-sm mt-1">{errors.job_title}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Company Name *</label>
          <input
            type="text"
            required
            value={data.company_name}
            onChange={(e) => setData('company_name', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.company_name && <p className="text-red-600 text-sm mt-1">{errors.company_name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Date Range From *</label>
            <input
              type="date"
              required
              value={data.date_from}
              onChange={(e) => setData('date_from', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.date_from && <p className="text-red-600 text-sm mt-1">{errors.date_from}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date Range To *</label>
            <input
              type="date"
              required
              value={data.date_to}
              onChange={(e) => setData('date_to', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.date_to && <p className="text-red-600 text-sm mt-1">{errors.date_to}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Salary Range From *</label>
            <input
              type="number"
              min="0"
              required
              value={data.salary_range_from}
              onChange={(e) => setData('salary_range_from', e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.salary_range_from && <p className="text-red-600 text-sm mt-1">{errors.salary_range_from}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Salary Range To *</label>
            <input
              type="number"
              min="0"
              required
              value={data.salary_range_to}
              onChange={(e) => setData('salary_range_to', e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.salary_range_to && <p className="text-red-600 text-sm mt-1">{errors.salary_range_to}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Posting Date *</label>
            <input
              type="date"
              required
              value={data.posting_date}
              onChange={(e) => setData('posting_date', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.posting_date && <p className="text-red-600 text-sm mt-1">{errors.posting_date}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Quantity *</label>
            <input
              type="number"
              min="1"
              required
              value={data.quantity}
              onChange={(e) => setData('quantity', e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description *</label>
          <textarea
            required
            rows={5}
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-60"
        >
          {processing ? 'Posting...' : 'Post Opportunity'}
        </button>
      </form>
    </div>
  );
}
