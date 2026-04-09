'use client';

type SubscriptionCardProps = {
  name: string;
  price: string;
  interval: string;
  nextPaymentDate: string;
};

export function SubscriptionCard({
  name,
  price,
  interval,
  nextPaymentDate,
}: SubscriptionCardProps) {
  return (
    <article className="rounded-xl border border-gray-800 bg-gray-950/50 p-5">
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-300 sm:grid-cols-3">
        <div>
          <dt className="text-gray-500">Price</dt>
          <dd className="mt-1 text-base text-white">{price}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Interval</dt>
          <dd className="mt-1 text-base text-white">{interval}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Next payment date</dt>
          <dd className="mt-1 text-base text-white">{nextPaymentDate}</dd>
        </div>
      </dl>
    </article>
  );
}
