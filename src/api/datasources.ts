import S3 from 'aws-sdk/clients/s3';

const s3 = new S3();

interface lsResult {
    files: string[];
    folders: string[]
}

// Make a URL from a bucket name
export function bucketNameToURL(bucket: string): string { return `https://${bucket}.s3.amazonaws.com` }

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

            Array.prototype.push.apply(result.files, response.Contents.map((element: S3.Object) => returnURL? `${url}${delimiter}${element.Key}`: element.Key))
            Array.prototype.push.apply(result.folders, response.CommonPrefixes.map((element: S3.CommonPrefix) => returnURL? `${url}${delimiter}${element.Prefix}`: element.Prefix))
            isTruncated = response.IsTruncated;
            if (isTruncated) {
                params.Marker = response.Contents.slice(-1)[0].Key;
            }
        }
        catch (err) { alert(err) }

        return result
    }
}