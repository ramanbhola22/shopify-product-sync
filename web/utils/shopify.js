import shopify from "../shopify.js";
import { GraphqlQueryError } from "@shopify/shopify-api";


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

export const syncMetaFields = async (session) => {
    await syncVapeMetaObject(session);
    await syncNAMetaObject(session);
    await syncExciseTaxProductType(session);
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
                                    key: "wholesale_price",
                                    name: "Wholesale Price",
                                    type: "money",
                                    description: "",
                                    required: true,
                                    validations: []
                                },
                                {
                                    key: "has_nicotine",
                                    name: "Has Nicotine",
                                    type: "boolean",
                                    description: "",
                                    required: true,
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
        } else {
            console.log("Vape field already added");
        }

    } catch (error) {
        if (error instanceof GraphqlQueryError) {
            console.log(`${error.message}${JSON.stringify(error.response, null, 2)}`);
        } else {
            console.log(error);
        }
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
        } else {
            console.log("N/A field already added");
        }

    } catch (error) {
        if (error instanceof GraphqlQueryError) {
            console.log(`${error.message}${JSON.stringify(error.response, null, 2)}`);
        } else {
            console.log(error);
        }
    }
}

const syncExciseTaxProductType = async (session) => {
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
                                    value: "[\"gid://shopify/MetaobjectDefinition/364118323\",\"gid://shopify/MetaobjectDefinition/364151091\"]"
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

