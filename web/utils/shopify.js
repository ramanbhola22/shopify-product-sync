import shopify from "../shopify.js";
import { GraphqlQueryError } from "@shopify/shopify-api";
import axios from 'axios';
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";

const GET_META_OBJECT_BY_TYPE = `
query MetaobjectDefinitionByType($type: String!) {  
    metaobjectDefinitionByType(type: $type) {    
        id
        type
        name,
        metaobjectsCount
    }
}
`;

const CREATE_META_OBJECT_MUTATION = `
mutation MetaobjectDefinitionCreate($input: MetaobjectDefinitionCreateInput!) {  
    metaobjectDefinitionCreate(definition: $input) {    
        metaobjectDefinition {      
            id      
            type      
            __typename
        }
        userErrors {      
            field
            message
            __typename
        }__typename  
    }
}
`;


const GET_META_DEFINITION = `
query MetafieldDefinitions($key: String!, $namespace: String!, $ownerType: MetafieldOwnerType!, $first: Int!) {  
    metafieldDefinitions(key: $key, namespace: $namespace, ownerType: $ownerType, first: $first) {    
        edges {      
            cursor
            node {   
                id
                name
                key
                namespace
                validationStatus
                pinnedPosition
                type {  
                    name
                    category
                }        
                metafieldsCount
            }      
        }    
    }
}
`;

const CREATE_META_DEFINITION_MUTATION = `
mutation MetafieldDefinitionCreateMutation($input: MetafieldDefinitionInput!) {  
    metafieldDefinitionCreate(definition: $input) {    
        userErrors {      
            code      
            message      
            field      
            __typename    
        }
        __typename
    }
}
`;

const GET_META_OBJECT_BY_HANDLE = `
query MetaobjectDetails($id: ID!) {
    metaobject(id: $id) {
        id
        displayName
        type
        handle
        fields {
            key
            value
            type
        }
    }
}
`;

export const syncMetaFields = async (session) => {
    let vapDefintionId = await syncVapeMetaObject(session);
    let nbDefintionId = await syncNAMetaObject(session);
    await syncExciseTaxProductType(session, [vapDefintionId, nbDefintionId]);
}

const syncVapeMetaObject = async (session) => {
    try {
        const client = new shopify.api.clients.Graphql({ session });
        let vapeField = await client.query({
            data: {
                query: GET_META_OBJECT_BY_TYPE,
                variables: {
                    type: "vape"
                }
            }
        });

        let metaData = vapeField.body.data.metaobjectDefinitionByType;

        if (metaData === null || metaData === "null") {
            console.log("Vape field not found, adding new");

            await client.query({
                data: {
                    query: CREATE_META_OBJECT_MUTATION,
                    variables: {
                        input: {
                            name: "Vape",
                            type: "vape",
                            displayNameKey: null,
                            fieldDefinitions: [
                                {
                                    key: "is_exempt",
                                    name: "Is Exempt",
                                    type: "boolean",
                                    required: true,
                                    description: "",
                                    validations: []
                                },
                                {
                                    key: "brand",
                                    name: "Brand",
                                    type: "single_line_text_field",
                                    required: true,
                                    description: "",
                                    validations: []
                                },
                                {
                                    key: "volume_in_ml",
                                    name: "Volumne In ML",
                                    type: "volume",
                                    required: true,
                                    description: "",
                                    validations: []
                                },
                                {
                                    key: "wholesale_cost",
                                    name: "Wholesale Cost",
                                    type: "money",
                                    required: true,
                                    description: "",
                                    validations: []
                                },
                                {
                                    key: "wholesale_price",
                                    name: "Wholesale Price",
                                    type: "money",
                                    required: true,
                                    description: "",
                                    validations: []
                                },
                                {
                                    key: "msrp",
                                    name: "MSRP",
                                    type: "money",
                                    required: true,
                                    description: "",
                                    validations: []
                                },
                                {
                                    key: "retail_price",
                                    name: "Retail Price",
                                    type: "money",
                                    required: true,
                                    description: "",
                                    validations: []
                                },
                                {
                                    key: "has_nicotine",
                                    name: "Has Nicotine",
                                    type: "boolean",
                                    required: true,
                                    description: "",
                                    validations: []
                                },
                                {
                                    key: "vape_system_type",
                                    name: "Vape System Type",
                                    type: "single_line_text_field",
                                    required: true,
                                    validations: [
                                        {
                                            name: "choices",
                                            // value: "[\"ddd\",\"dsfsdf\"]",   
                                            value: JSON.stringify(["isLiquid", "isPart", "isOpen", "closedSingleUse", "closedRefillable", "closedCartridge", "batteryOnly", "pack"])
                                        }
                                    ]
                                },
                                {
                                    key: "pack_quantity",
                                    name: "Pack Quantity",
                                    type: "number_integer",
                                    required: true,
                                    description: "",
                                    validations: []
                                }
                            ],
                            access: {
                                storefront: "PUBLIC_READ"
                            },
                            capabilities: {
                                publishable: {
                                    enabled: true
                                },
                                translatable: {
                                    enabled: true
                                }
                            }
                        }
                    },
                },
            });
            return syncVapeMetaObject(session);
        } else {
            console.log("Vape field found");
            return metaData.id;
        }

    } catch (error) {
        if (error instanceof GraphqlQueryError) {
            console.log(`${error.message}${JSON.stringify(error.response, null, 2)}`);
        } else {
            console.log(error);
        }
        return null;
    }
}

const syncNAMetaObject = async (session) => {
    try {
        const client = new shopify.api.clients.Graphql({ session });
        let vapeField = await client.query({
            data: {
                query: GET_META_OBJECT_BY_TYPE,
                variables: {
                    type: "n-a"
                }
            }
        });

        let metaData = vapeField.body.data.metaobjectDefinitionByType;

        if (metaData === null || metaData === "null") {
            console.log("N/A field not found, adding new");

            await client.query({
                data: {
                    query: CREATE_META_OBJECT_MUTATION,
                    variables: {
                        input: {
                            name: "N/A",
                            type: "n-a",
                            displayNameKey: null,
                            fieldDefinitions: [
                                {
                                    key: "message",
                                    name: "Message",
                                    type: "single_line_text_field",
                                    description: "",
                                    required: false,
                                    validations: []
                                }
                            ],
                            access: {
                                storefront: "PUBLIC_READ"
                            },
                            capabilities: {
                                publishable: {
                                    enabled: true
                                },
                                translatable: {
                                    enabled: true
                                }
                            }
                        }
                    },
                },
            });

            return syncNAMetaObject(session);

        } else {
            console.log("N/A field found");
            return metaData.id;
        }

    } catch (error) {
        if (error instanceof GraphqlQueryError) {
            console.log(`${error.message}${JSON.stringify(error.response, null, 2)}`);
        } else {
            console.log(error);
        }
        return null;
    }
}

const syncExciseTaxProductType = async (session, definitionIds) => {
    try {
        const client = new shopify.api.clients.Graphql({ session });
        let vapeField = await client.query({
            data: {
                query: GET_META_DEFINITION,
                variables: {
                    key: "excise_tax_product_type",
                    namespace: "custom",
                    ownerType: "PRODUCT",
                    first: 64
                }
            }
        });

        if (vapeField.body.data.metafieldDefinitions.edges.length <= 0) {
            console.log("Excise Tax Product Type field not found, adding new");

            await client.query({
                data: {
                    query: CREATE_META_DEFINITION_MUTATION,
                    variables: {
                        input: {
                            ownerType: "PRODUCT",
                            visibleToStorefrontApi: true,
                            useAsCollectionCondition: false,
                            pin: true,
                            namespace: "custom",
                            key: "excise_tax_product_type",
                            type: "mixed_reference",
                            validations: [
                                {
                                    name: "metaobject_definition_ids",
                                    value: JSON.stringify(definitionIds)
                                }
                            ],
                            name: "Excise Tax Product Type",
                            description: ""
                        }
                    },
                },
            });

        } else {
            console.log("Excise Tax Product Type field already added");
        }

    } catch (error) {
        if (error instanceof GraphqlQueryError) {
            console.log(`${error.message}${JSON.stringify(error.response, null, 2)}`);
        } else {
            console.log(error);
        }
    }
}

export const syncWebhook = async (session) => {
    try {
        const webHookTopics = ["products/create", "products/update"];

        let webhookUrl = process.env.APP_URL + "/api/webhooks";

        let allWebhooks = await shopify.api.rest.Webhook.all({
            session: session,
        });

        for (let webHookTopic of webHookTopics) {
            let haveWebhook = false;
            for (let webhookItem of allWebhooks.data) {
                if (webhookItem.address == webhookUrl && webhookItem.topic == webHookTopic) {
                    haveWebhook = true;
                }
            }
            if (!haveWebhook) {
                const webhookModel = new shopify.api.rest.Webhook({ session: session });
                webhookModel.address = webhookUrl;
                webhookModel.topic = webHookTopic;
                webhookModel.format = "json";
                await webhookModel.save({
                    update: true
                });
                console.log(webHookTopic + " - Webhook Created");
            } else {
                console.log(webHookTopic + " - Webhook already exist");
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const syncProductDataToToT = async (productInfo) => {
    let data = JSON.stringify({
        apiKey: process.env.TOT_API_KEY,
        secretKey: process.env.TOT_SECRET_KEY,
        product: productInfo
    });

    console.log(data);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.TOT_API_BASE_URL + '/api/product',
        headers: {
            "Content-Type": 'application/json',
        },
        data: data
    };

    console.log("Product sync to tot - " + productInfo.sku)

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log("sync failed");
            console.log(error.response.data);
        });
}

export const getSesionByShop = async (shop) => {
    let storage = new MongoDBSessionStorage(
        process.env.DB_URL,
        process.env.DB_NAME
    );
    let session = await storage.findSessionsByShop(shop);
    return session[0];
}

export const syncProductToToT = async (product, shop) => {
    let session = await getSesionByShop(shop);
    let productMetaFields = await shopify.api.rest.Metafield.all({
        session: session,
        metafield: { owner_id: product.id, owner_resource: "product" },
    });
    const client = new shopify.api.clients.Graphql({ session });
    productMetaFields = productMetaFields.data;
    for (let productMetaField of productMetaFields) {
        if (productMetaField.key === "excise_tax_product_type") {
            let metaObjectId = productMetaField.value.toString();
            let productMetaObject = await client.query({
                data: {
                    query: GET_META_OBJECT_BY_HANDLE,
                    variables: {
                        id: metaObjectId
                    }
                }
            });
            productMetaObject = productMetaObject.body.data.metaobject;
            if (product.variants[0].sku != "") {
                let productData = {
                    sku: product.variants[0].sku,
                    name: product.title
                };
                for (let fieldItem of productMetaObject.fields) {
                    switch (fieldItem.key) {
                        case "is_exempt":
                            productData["isExempt"] = fieldItem.value;
                            break;
                        case "brand":
                            productData["brand"] = fieldItem.value;
                            break;
                        case "volume_in_ml":
                            productData["volumeInMl"] = JSON.parse(fieldItem.value).value;
                            break;
                        case "wholesale_cost":
                            productData["wholesaleCost"] = JSON.parse(fieldItem.value).amount;
                            break;
                        case "wholesale_price":
                            productData["wholesalePrice"] = JSON.parse(fieldItem.value).amount;
                            break;
                        case "msrp":
                            productData["msrp"] = JSON.parse(fieldItem.value).amount;
                            break;
                        case "retail_price":
                            productData["retailPrice"] = JSON.parse(fieldItem.value).amount;
                            break;
                        case "has_nicotine":
                            productData["hasNicotine"] = fieldItem.value;
                            break;
                        case "vape_system_type":
                            productData["vapeSystemType"] = fieldItem.value;
                            break;
                        case "pack_quantity":
                            productData["packQuantity"] = fieldItem.value;
                            break;
                    }
                }
                await syncProductDataToToT(productData);
            } else {
                console.log("Product is without SKU");
            }
        }
    }
}