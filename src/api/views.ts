import { supabase } from "./supabase";
import { Camelized } from "../types/camel";
import { camelize, stringToDate } from "./util";
import { ViewQueryResult } from "../types/database";
import { ToDate } from "../types/stringtodate";

export async function fetchViews() {
    const { data, error } = await supabase
    .from('view')
    .select(`
      name,
      dataset_name,
      description,
      thumbnail_url,
      position,
      scale,
      orientation,
      taxa:taxon(name, short_name),
      created_at,
      imagery:imagery(
        name,
        description,
        url,
        format,
        display_settings,
        sample_type,
        grid_scale,
        grid_translation,
        grid_dims,
        grid_units,
        content_type,
        institution,
        created_at),
      dataset!inner(name)`).returns<ViewQueryResult>()
    if (error === null) {
      const camelized = camelize(data) as Camelized<typeof data>
      const dateified = stringToDate(camelized) as ToDate<typeof camelized>
      return dateified
    }
    else {
      throw new Error(`Oops! ${JSON.stringify(error)}`)
    }
  }