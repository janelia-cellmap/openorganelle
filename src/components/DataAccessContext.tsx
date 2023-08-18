const awsCliLs = (bucket: string) => {
    return `aws s3 ls s3://${bucket} --no-sign-request`
}

const awsCliCp = (bucket: string, path: string) => {
    return `aws s3 cp s3://${bucket}/${path} $YOUR_DIRECTORY --recursive --no-sign-request`
}

const pythonInstallZarrCmd = `pip install zarr`

export const pythonAccessN5Cmd = (n5_root: string, component: string) => {
    return `
    from zarr import N5FSStore
    array = zarr.open(N5FSStore(${n5_root}), path=${component})
    `
}