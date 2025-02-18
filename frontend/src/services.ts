export async function getNonce(address: string, isAlgo: boolean = false) {
  const response = await fetch(`/account/${isAlgo ? "algo" : ""}nonce`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });
  const { nonce } = await response.json();

  return nonce as number;
}

export async function auth(address: string, signature: string, session: string) {
  const response = await fetch("/account/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, signature, session }),
  });

  return await response.json() as { accessToken: string, name?: string };
}

export async function algoAuth(address: string, signature: string, session: string, message: string) {

  const response = await fetch("/account/algoauth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, signature, session, message }),
  });

  return await response.json() as { accessToken: string, name?: string };
}

export async function login(accessToken: string) {
  await fetch('/account/login', {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function register(accessToken: string, name: string) {
  await fetch('/account/register', {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name })
  });
}
