import { supabase } from "./supabase";
import { camelize, Camelized } from "./camel";
import { ensureArray } from "./util";

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
      tags,
      created_at,
      images:image(
        name,
        description,
        url,
        format,
        transform,
        display_settings,
        sample_type,
        content_type,
        institution,
        created_at,
        meshes:mesh(
            name,
            description,
            url,
            transform,
            created_at
            )
    ),
      dataset!inner(name)`).eq('dataset.is_published', true)
    if (error === null) {
      const result = data!.map(d => {
        return {...d,
                images: ensureArray(d.images).map(im => {
                    return {...im, meshes: ensureArray(im.meshes)}
                }),
                }
      })
      return camelize(result) as Camelized<typeof result>
    }
    else {
      throw new Error(`Oops! ${JSON.stringify(error)}`)
    }
  }