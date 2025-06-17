export const getWalletAddressFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const address = urlParams.get("address");
  return address ? encodeURIComponent(address) : null;
};
