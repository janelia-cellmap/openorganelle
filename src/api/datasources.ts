import S3 from 'aws-sdk/clients/s3';
const assert = require('assert');

/*
const s3Ls = require('s3-ls');
const lister = s3Ls({bucket: 'janelia-cosem-dev'});
async function dothing(){
        const tmp = console.log('lets ask s3 about it'); 
        try {
        const response = await lister.ls("test.n5"); console.log(response)}
        catch(err) {alert(err)} }
dothing()
*/
const s3 = new S3();

interface lsResult {
    files: string[];
    folders: string[]
}

// Make a URL from a bucket name
function bucketNameToURL(bucket: string): string { return `https://${bucket}.s3.amazonaws.com` }

// Generate an object from a web-hosted file 
export async function getObjectFromJSON(url: string): Promise<any> {
    return fetch(url)
        .then(response => {
            return response.json();
        }).catch(error => console.log(`Failed because: ${error}`));
}

// List files and folders on s3
export async function s3ls(bucket: string, prefix: string, delimiter: string, marker: string, returnURL: boolean): Promise<lsResult> {
    let isTruncated: boolean | undefined = true;
    let result = { files: [], folders: [] }
    let url = '';
    let params: S3.ListObjectsRequest = { Bucket: bucket };
    if (prefix) params.Prefix = prefix;
    if (delimiter) params.Delimiter = delimiter;
    if (marker) params.Marker = marker;
    if (returnURL === true) { url = bucketNameToURL(bucket) }

    while (isTruncated) {
        try {            
            const response = await s3.makeUnauthenticatedRequest('listObjectsV2', params).promise();

            Array.prototype.push.apply(result.files, response.Contents.map((element: S3.Object) => `${url}${delimiter}${element.Key}`))
            Array.prototype.push.apply(result.folders, response.CommonPrefixes.map((element: S3.CommonPrefix) => `${url}${delimiter}${element.Prefix}`))
            isTruncated = response.IsTruncated;
            if (isTruncated) {
                params.Marker = response.Contents.slice(-1)[0].Key;
            }
        }
        catch (err) { alert(err) }

        return result
    }
}


    // make sure we get the right results when we run s3ls on a dataset in our test bucket 
    export async function tests3ls(): Promise<null> {
        console.log('begin test')
        const results = await s3ls('janelia-cosem-dev', 'test.n5/', '/', '', true)
        console.log(results)
        assert(results.files[0] === "https://janelia-cosem-dev.s3.amazonaws.com/test.n5/attributes.json")
        assert(results.folders[0] ===  "https://janelia-cosem-dev.s3.amazonaws.com/test.n5/gt/");

        console.log('success!')
        return null
    }