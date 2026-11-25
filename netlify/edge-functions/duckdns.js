export default async (request) => {
  const url = new URL(request.url);

  // 如果路由绑定在 /duck/*，这里剥离前缀；若绑定在根路径，可按需调整
  const forwardPath = url.pathname.replace(/^\/duck/, "") || "/";
  const target = `https://www.duckdns.org${forwardPath}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set("User-Agent", "Mozilla/5.0");
  headers.delete("host");

  const hasBody = !["GET", "HEAD"].includes(request.method.toUpperCase());

  const upstreamResp = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    redirect: "manual"
  });

  return new Response(upstreamResp.body, {
    status: upstreamResp.status,
    statusText: upstreamResp.statusText,
    headers: upstreamResp.headers
  });
};