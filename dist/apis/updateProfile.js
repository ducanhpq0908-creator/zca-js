import { ZaloApiError } from "../Errors/ZaloApiError.js";
import { apiFactory } from "../utils.js";
export const updateProfileFactory = apiFactory()((api, ctx, utils) => {
    const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/update`);
    /**
     * Change account setting information
     *
     * @param payload payload
     *
     * @note If your account is a Business Account, include the biz.cate field; otherwise the category will be removed.
     * You may leave the other biz fields empty if you don’t want to change them.
     *
     * @throws {ZaloApiError}
     */
    return async function updateProfile(payload) {
        const params = {
            profile: JSON.stringify({
                name: payload.profile.name,
                dob: payload.profile.dob,
                gender: payload.profile.gender,
            }),
            biz: JSON.stringify({
                desc: payload.biz?.description,
                cate: payload.biz?.cate,
                addr: payload.biz?.address,
                website: payload.biz?.website,
                email: payload.biz?.email,
            }),
            language: ctx.language,
        };
        const encryptedParams = utils.encodeAES(JSON.stringify(params));
        if (!encryptedParams)
            throw new ZaloApiError("Failed to encrypt params");
        const response = await utils.request(serviceURL, {
            method: "POST",
            body: new URLSearchParams({
                params: encryptedParams,
            }),
        });
        return utils.resolve(response);
    };
});
