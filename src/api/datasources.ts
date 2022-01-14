interface lsResult {
    files: string[];
    folders: string[]
}

// Make a URL from a bucket name
export function bucketNameToURL(bucket: string): string { return `https://${bucket}.s3.amazonaws.com` }

export function s3URItoURL(uri: string) : string {
    const uri_split = uri.split('://')
    if (uri_split[0] !== 's3') {throw Error(`The input ${uri} is not an s3 URI`);
    }
    else{
        let bucket = uri_split[1].split('/')[0];
        let bucketURL = bucketNameToURL(bucket);
        return `${bucketURL}/${uri_split[1].slice(1 + bucket.length, uri_split[1].length)}`;
    }
}

// Generate an object from a web-hosted file 
export async function getObjectFromJSON(url: string): Promise<any> {
    return fetch(url)
        .then(response => {
            return response.json();
        }).catch(error => console.log(`Failed to parse ${url} as JSON because: ${error}`));
}
