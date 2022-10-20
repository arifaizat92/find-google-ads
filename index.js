async function findGoogleAds(
  accessToken,
  customerId,
  managerId = null,
  campaignId = null,
  adId = null,
  campaignType = null,
  keywords = null
) {
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "developer-token": DEVELOPER_TOKEN,
    },
  };

  //if the account is an MCC account, add the MCC account id as header
  if (managerId) {
    headers.headers["login-customer-id"] = managerId;
  }

  let query =
    "SELECT ad_group_ad.ad.id, ad_group_ad.ad.name, ad_group.id, ad_group.name, campaign.id, campaign.name, campaign.advertising_channel_type " +
    `FROM ad_group_ad WHERE ad_group_ad.ad.id = ${adId}`;

  if (campaignType == "PERFORMANCE_MAX") {
    query =
      "SELECT ad_group_ad.ad.id, ad_group_ad.ad.name, ad_group.id, ad_group.name, campaign.id, campaign.name, campaign.advertising_channel_type " +
      `FROM ad_group_ad WHERE campaign.id = ${campaignId}`;
  } else if (campaignType = "SEARCH") {
    if (keywords) {
      let data = keywords.map(function (x) {
        return "'" + x + "'";
      });

      result = data.join(", ");
      result = "(" + result + ")";

      query =
        "SELECT ad_group_ad.ad.id, ad_group_ad.ad.name, ad_group.id, ad_group.name, campaign.id, campaign.name, campaign.advertising_channel_type, segments.keyword.info.text " +
        `FROM ad_group_ad WHERE ad_group_ad.ad.id = ${adId} AND segments.keyword.info.text IN ${result}`;
    }
  }

  const {
    data: [{ results: ad_res }],
  } = await axios.post(
    `https://googleads.googleapis.com/v11/customers/${customerId}/googleAds:searchStream`,
    {
      query: query,
    },
    headers
  );

  return ad_res;
}
