export async function enableMocking() {
  const { worker } = await import('@/mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
}
