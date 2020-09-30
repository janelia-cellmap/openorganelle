import { Checkbox, createStyles, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { ContentType, Dataset, Volume } from "../api/datasets";

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
    })
);

type LayerCheckBoxListProps = {
    dataset: Dataset;
    checkState: Map<string, boolean>;
    handleChange: any;
}

export default function LayerCheckboxList({ dataset, checkState, handleChange }: LayerCheckBoxListProps) {
    const classes = useStyles();
    const checkboxGroups: Map<ContentType, JSX.Element[]> = new Map();
    dataset.volumes.forEach((volume: Volume, key: string) => {

        let cb = <FormControlLabel
            control={
                <Checkbox
                    checked={checkState.get(key)}
                    onChange={handleChange}
                    color="primary"
                    name={key}
                    size="small"
                />
            }
            label={volume.name}
            key={`${dataset.key}/${key}`}
        />;

        if (checkboxGroups.get(volume.contentType) === undefined) { checkboxGroups.set(volume.contentType, []) }
        checkboxGroups.get(volume.contentType).push(cb);
    });
    return (
        <Grid item>
            <Typography variant="h6">Select layers</Typography>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">EM</FormLabel>
                <Divider />
                <FormGroup className={classes.formGroup}>{checkboxGroups.get('em')}</FormGroup>
                {(checkboxGroups.get('segmentation').length === 0) && <React.Fragment><FormLabel component="legend">Segmentation</FormLabel><Divider /><FormGroup className={classes.formGroup}>{checkboxGroups.get('segmentation')}</FormGroup></React.Fragment>}
            </FormControl>
        </Grid>
    );
};
