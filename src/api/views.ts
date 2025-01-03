import { supabase } from "./supabase";
import { Camelized } from "../types/camel";
import { camelize } from "./util";
import { ViewQueryResult } from "../types/database";

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
      images:image(
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
        created_at,
        image_stack,
        meshes:mesh(
            name,
            description,
            url,
            grid_scale,
            grid_translation,
            grid_dims,
            grid_units,
            created_at,
            format,
            ids
            )
    ),
      dataset!inner(name)`).returns<ViewQueryResult>()
    if (error === null) {
      const camelized = camelize(data) as Camelized<typeof data>
      return camelized
    }
    else {
      throw new Error(`Oops! ${JSON.stringify(error)}`)
    }
  }