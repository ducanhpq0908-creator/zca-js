import { ZaloApiError } from "../Errors/ZaloApiError.js";
import { apiFactory } from "../utils.js";
export const getGroupInviteBoxInfoFactory = apiFactory()((api, _, utils) => {
    const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/inv-box/inv-info`);
    /**
     * Get group invite box info
     *
     * @param payload - The payload of the request
     *
     * @throws {ZaloApiError}
     */
    return async function getGroupInviteBoxInfo(payload) {
        const params = {
            grId: payload.groupId,
            mcount: payload.mcount ?? 10,
            mpage: payload.mpage ?? 1,
        };
        const encryptedParams = utils.encodeAES(JSON.stringify(params));
        if (!encryptedParams)
            throw new ZaloApiError("Failed to encrypt params");
        const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), {
            method: "GET",
        });
        return utils.resolve(response, (result) => {
            const data = result.data;
            const topic = data.groupInfo.topic;
            if (typeof topic.params == "string") {
                const params = JSON.parse(topic.params);
                if (typeof params.extra == "string") {
                    params.extra = JSON.parse(params.extra);
                }
                topic.params = params;
            }
            return data;
        });
    };
});
