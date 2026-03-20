export default async function AndroidConfigPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">🚧 Android設定</h2>
        <p className="text-gray-500">現在開発中です。iOS設定を参考に実装予定です。</p>
      </div>
    </div>
  );
}
