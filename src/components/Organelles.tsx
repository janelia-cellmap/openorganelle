import React, { useContext } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import "./Organelles.css";
import { DatasetView } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ImageLayer } from "@janelia-cosem/neuroglancer-url-tools";
class OrganelleTableEntry {
  constructor(
    public full_name: string,
    public short_name: string,
    public file_name: string,
    public description: string,
    public examples: Array<DatasetView>
  ) {}
}

const demo_dataset_names = [
  "jrc_hela-2",
  "jrc_hela-3",
  "jrc_jurkat-1",
  "jrc_macrophage-2",
];

const tableData = [
  new OrganelleTableEntry(
    "Centrosome",
    "Centrosome",
    "cent",
    "Barrel-shaped structure composed of microtubule triplets. Centrioles are often found in pairs and microtubule staining is dark and distinct. A cross section of centriole ends is a round, nine-fold star shape. Skeleton annotations in BigCat were used to trace each microtubule of the barrel structure. These skeletons were then used to inpaint a full microtubule triplet into the volume. Voxel classification was used to annotate distal (D App) and subdistal appendages (SD App).",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [24834.125, 4931.677734375, 14897.5],
        6.834771272276192
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [28310.619140625, 3037.556396484375, 10741.5],
        2.671353019658504
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [5523.84423828125, 6210.2314453125, 15452.810546875],
        3.6039231119383004
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [21723.33984375, 4799.5, 20980.5],
        5.430455441247891
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Centrosome Distal Appendage",
    "Centrosome SD App",
    "cent-sdapp",
    "",
    []
  ),
  new OrganelleTableEntry(
    "Chromatin",
    "Chromatin",
    "chrom",
    "Protein and DNA complexes within the nucleus.",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [25878.65625, 3042.866943359375, 16238.5],
        11.045498897968907
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [20657.3203125, 2286.20263671875, 19444.5],
        7.940871305346032
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [18039.82421875, 6734.81689453125, 18075.4453125],
        7.3670916293080895
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [13386.9228515625, 5301.8193359375, 18624.5],
        6.8347712722761855
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Euchromatin",
    "E Chrom",
    "echrom",
    "Light, single chromatin within the nucleus. Euchromatin stain is lighter and less compact than heterochromatin. Nucleolus euchromatin (N-E Chrom) is not associated with or connected to euchromatin (E Chrom) outside the nucleolus.",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [16978.822265625, 2921.7509765625, 12897.5],
        0.9203723205358448
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [27499.412109375, 2316.5, 18988.5],
        0.7203795921556103
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [17931.806640625, 6049.71826171875, 6054.5],
        0.9871068435746017
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [15266.125, 4853.49462890625, 18645.5],
        0.5444511834277151
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Heterochromatin",
    "H Chrom",
    "hchrom",
    " Dark clusters of chromatin within the nucleus. Heterochromatin stain is darker and more compact than euchromatin. Nucleolus heterochromatin (N-H Chrom) is not associated with or connected to heterochromatin (H Chrom) outside the nucleolus. ",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [23998.06640625, 2925.3076171875, 13858.5],
        3.428157707713824
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [25696.5, 1824.393798828125, 10395.5],
        2.1641398950982564
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [9010.77734375, 8510.279296875, 21761.5],
        2.142606343351916
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [14548.23046875, 5985.79296875, 21364.5],
        6.001581425572742
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Endoplasmic Reticulum",
    "ER",
    "er",
    "An extensive network of tubular structures often studded with ribosomes. The endoplasmic reticulum is distinct from multivesicular bodies based on connectivity; ER networks always connect back to themselves and ultimately connect back to the nuclear envelope. In contrast, the morphologically-similar multivesicular bodies are disconnected. ER exit sites (ERES), nuclear envelope (NE), and associated nuclear pores (NP) are included in the ER superclass.",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [35298.2265625, 4749.23681640625, 16247.5],
        1.9003213537587145
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [11177.7099609375, 3082.054931640625, 19451.5],
        1.7367629472369266
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [13333.87109375, 6646.5, 18122.5],
        2.2078584209846404
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [28972.162109375, 5662.0068359375, 18413.04296875],
        2.089705204245983
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Endoplasmic Reticulum Exit Site",
    "ERES",
    "eres",
    " A cluster of tubular structures and vesicles that bud from the endoplasmic reticulum. Endoplasmic reticulum exit site lumen and morphology is generally consistent with the corresponding ER network. ",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [37011.81640625, 4062.369384765625, 9993.68359375],
        2.489353418393179
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [13708.41796875, 3198.68310546875, 19057.5],
        3.0710606957499955
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [10793.9921875, 7579.6103515625, 21908.5],
        3.2447003551933493
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [28965.1953125, 5513.443359375, 17615.0],
        2.309481419083985
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Endoplasmic Reticulum Exit Site membrane",
    "ERES mem",
    "eres-mem",
    "",
    []
  ),
  new OrganelleTableEntry(
    "Endoplasmic Reticulum membrane",
    "ER mem",
    "er-mem",
    "",
    []
  ),
  new OrganelleTableEntry(
    "Endosomal Network",
    "Endo",
    "endo",
    "Light lumen organelles that constitute the endosomal network. These structures have a few characteristic morphologies, including \u2018ribbon\u2019 structures and spheres with multiple membrane invaginations. The endosomal network class includes autophagosomes, endosomes, and peroxisomes as EM staining alone is not sufficient for differentiation.",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [11121.8115234375, 3303.464111328125, 12878.5],
        2.69668436501776
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [39109.76953125, 2961.509033203125, 18720.5],
        2.1749876914651223
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [17141.326171875, 8831.28125, 22145.427734375],
        1.6603410040994775
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [19509.19140625, 2679.297607421875, 17616.5],
        2.1968466811703515
      ),
    ]
  ),
  new OrganelleTableEntry("Endosome membrane", "Endo mem", "endo-mem", "", []),
  new OrganelleTableEntry(
    "Extracellular Space",
    "ECS",
    "ecs",
    "Defined as any volume outside of the plasma membrane boundary, including both cellular plasma membrane and membrane surrounding secreted vesicles; it does not contain any stained organelles or molecules and is not defined by a particular morphology or contrast.",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [12469.8427734375, 1130.725830078125, 12902.5],
        5.766256051903022
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [31238.453125, 831.47216796875, 18988.5],
        9.747618564959009
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [24350.47265625, 4121.43896484375, 21720.86328125],
        11.212430236526277
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [7863.55078125, 4045.055908203125, 18645.5],
        5.512526265224186
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Golgi",
    "Golgi",
    "golgi",
    "Stacked, \u2018pancake-like\u2019 structures that uniformly morph and bend together. Gaps of a similar thickness to each Golgi layer compose a Golgi apparatus that often consists of 5-7 layers. Stacks may be interconnected and often connect to ER network and endosomal network (Endo). Surrounding and budding vesicles are often included in the Golgi network. ",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [23662.580078125, 5235.5, 13858.5],
        3.394046968588006
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [31688.9375, 2458.26171875, 10175.521484375],
        5.269961228093141
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [11630.6279296875, 8735.474609375, 21721.5],
        3.148804967400616
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [19560.31640625, 4030.238525390625, 21354.75390625],
        2.0897052042459654
      ),
    ]
  ),
  new OrganelleTableEntry("Golgi membrane", "Golgi mem", "golgi-mem", "", []),
  new OrganelleTableEntry(
    "Lipid Droplet",
    "LD",
    "ld",
    "Spherical organelles enclosed by a lipid monolayer and characterized by a shriveled, \u2018lumpy\u2019 morphology due to general staining. Lipid droplets (LD) are generally lighter than surrounding cytosol and have subtle membrane staining. ",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [20307.119140625, 5230.5, 20728.369140625],
        1.816702428866956
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [16203.3857421875, 1783.5, 10311.6865234375],
        2.539641693244882
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [9503.7900390625, 8512.5, 23822.5],
        3.071060695749866
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [16734.732421875, 6596.5, 28098.5],
        2.552371700207675
      ),
    ]
  ),
  new OrganelleTableEntry("Lipid Droplet membrane", "LD mem", "ld-mem", "", []),
  new OrganelleTableEntry(
    "Lysosome",
    "Lyso",
    "lyso",
    "Spherical, dark lumen organelles that constitute the late endosomal network. Lysosomes can have multiple membranes; the lysosome class also includes autophagosomes, multivesicular bodies, endosomes, and peroxisomes as EM staining alone is not sufficient for differentiation.",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [22366.880859375, 4927.27685546875, 15095.5],
        1.1700225304605227
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [23603.00390625, 640.6011962890625, 10612.5],
        2.4769377164221504
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [2547.55810546875, 7085.5, 23793.65625],
        1.816702428866914
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [8844.8916015625, 6498.5, 26958.734375],
        4.043145610335109
      ),
    ]
  ),
  new OrganelleTableEntry("Lysosome membrane", "Lyso mem", "lyso-mem", "", []),
  new OrganelleTableEntry(
    "Microtubule",
    "MT",
    "mt",
    "Cylindrical, cytoskeletal polymers characterized by restricted curvature and a 25 nm diameter. Microtubules often run parallel, do not branch, and may appear to pierce through other organelles, especially ER.",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [25586.943359375, 4111.37841796875, 23615.8984375],
        1.5872818189033555
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [13792.28515625, 2622.464111328125, 25946.884765625],
        0.8976482469751267
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [27828.396484375, 9664.0361328125, 20560.5],
        0.9724107372692137
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [22084.671875, 4704.12060546875, 20421.5],
        1.2116983922845241
      ),
    ]
  ),
  new OrganelleTableEntry("Microtubule inner", "MT in", "mt-in", "", []),
  new OrganelleTableEntry("Microtubule outter", "MT out", "mt-out", "", []),
  new OrganelleTableEntry(
    "Mitochondria",
    "Mito",
    "mito",
    "Large, ovoid organelles characterized by outer and inner membranes that form cristae. Mitochondria can fuse and branch to form tubular networks. Inner membrane folding density varies based on cell type. Dark-staining aggregates within mitochondria lumen have been identified and termed mitochondrial ribosomes (Mito Ribo).",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [9410.2998046875, 4114.8193359375, 14102.7353515625],
        3.19639306033529
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [18499.74609375, 2555.54443359375, 25864.5],
        2.4893534183931534
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [29079.966796875, 8166.6201171875, 20637.408203125],
        2.980297135446793
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [21079.42578125, 3194.40625, 19289.5],
        3.5149419332613245
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Mitochondria membrane",
    "Mito mem",
    "mito-mem",
    "",
    []
  ),
  new OrganelleTableEntry(
    "Mitochondria Ribosome",
    "Mito Ribo",
    "mito-ribo",
    "",
    []
  ),
  new OrganelleTableEntry(
    "Nuclear Envelope",
    "NE",
    "ne",
    "An extensive membrane-like structure identified by the presence of two lipid bilayers often studded with ribosomes. The nuclear envelope connects back to itself and is continuous with ER networks. The double membrane structure is perforated with nuclear pores (NP) and establishes a boundary between chromatin (Chrom) and the cytosol.",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [17247.474609375, 5441.65771484375, 14103.5],
        1.1877051565652172
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [21501.451171875, 3197.88720703125, 23836.5],
        1.3324548668177507
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [15925.193359375, 6580.53466796875, 21139.2109375],
        1.643820335075574
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [22633.294921875, 4037.24072265625, 10932.5],
        1.5480916911588005
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Nuclear Envelope membrane",
    "NE mem",
    "ne-mem",
    "",
    []
  ),
  new OrganelleTableEntry(
    "Nuclear Pore",
    "NP",
    "np",
    "Circular, 120 nm pores in the nuclear envelope. When viewing a cross section of the nucleus, nuclear pores appear as breaks or gaps in envelope connectivity. Nuclear pores span both bilayers of the nuclear envelope (NE).",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [22141.791015625, 1232.700927734375, 16684.5],
        1.2300108683819138
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [21347.55859375, 3223.5, 23604.87890625],
        1.3324548668177507
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [18031.2109375, 5712.5, 18419.5],
        1.248600102113731
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [19199.5, 3143.52783203125, 12785.5],
        0.7025933566522808
      ),
    ]
  ),
  new OrganelleTableEntry("Nuclear Pore outer", "NP out", "np-out", "", []),
  new OrganelleTableEntry(
    "Nucleolus",
    "Nucleolus",
    "nucleolus",
    "A dark, dense spherical structure within the nucleus containing heterochromatin (N-H Chrom) and euchromatin (N-E Chrom).",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [19707.3828125, 3036.2861328125, 14673.0693359375],
        4.76845811077735
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [24608.8359375, 2058.97607421875, 18936.087890625],
        7.553590441818405
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [10253.5244140625, 6839.5, 18631.701171875],
        3.640143141371554
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [15892.5966796875, 5257.4033203125, 12932.759765625],
        5.737496729863766
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Nucleolus associated Euchromatin",
    "N-E Chrom",
    "nechrom",
    "Euchromatin associated with the Nucleolus.",
    []
  ),
  new OrganelleTableEntry(
    "Nucleolus associated Heterochromatin",
    "N-H Chrom",
    "nhchrom",
    "Heterochromatin associated with the Nucleolus.",
    []
  ),
  new OrganelleTableEntry(
    "Nucleus",
    "Nucleus",
    "nucleus",
    "The largest spherical organelle characterized by patches of high contrast chromatin and a dark, central nucleolus. In addition to heterochromatin and euchromatin, the nucleus class includes the nuclear envelope and associated nuclear pores, the nucleolus and associated nucleolus heterochromatin and euchromatin, and surrounding nucleoplasm.",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [23906.234375, 3411.78564453125, 14617.5],
        17.064887765049217
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [21988.5, 2036.5977783203125, 16180.466796875],
        11.905768200734133
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [19402.25390625, 8039.18896484375, 18437.5],
        7.59145297147106
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [17277.40234375, 4781.64404296875, 14914.5966796875],
        17.58459096890281
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Plasma Membrane",
    "PM",
    "pm",
    " A thin, extensive bilayer that surrounds the cell and separates extracellular space from cytosol. To be classified as plasma membrane, the membrane must always connect back to itself. Otherwise, the membrane is most likely part of the endosomal network (Endo). ",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [14104.39453125, 2137.424072265625, 14857.5],
        2.4278910635004314
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [35387.3203125, 1959.0615234375, 16180.466796875],
        2.4893534183931507
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [14141.5, 7550.58740234375, 22384.5],
        3.7322938037215394
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [27586.201171875, 4241.53125, 14920.5],
        3.71367891071658
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Ribosome",
    "Ribo",
    "ribo",
    "Macromolecular structures characterized by darkly stained ellipsoid spots which result from diffraction-limited resolution. Ribosomes are often found in clusters bound to ER or suspended in cytosol. Point annotations in BigCat are used to demark the centroid of ribosomes in a volume. These are then painted into a separate volume as points and virtually expanded to 18 nm as needed.",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [5525.28515625, 5215.1806640625, 15501.5],
        1.1641870187448156
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [32975.51953125, 2117.156982421875, 17141.5],
        0.44799330334393583
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [7973.5419921875, 9936.1279296875, 23764.01953125],
        0.7460393034533427
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [15090.810546875, 5099.11181640625, 25429.46484375],
        1.0222673018968507
      ),
    ]
  ),
  new OrganelleTableEntry(
    "Vesicle",
    "Vesicle",
    "vesicle",
    " Small, spherical organelles less than 100 nm in diameter with lumen varying in color depending on protein content. Vesicles are often found in clusters surrounding Golgi and ER. ",
    [
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [2161.434814453125, 5502.5, 15614.5],
        1.2423726831244588
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [11943.3740234375, 2370.5, 17449.267578125],
        2.1641398950982507
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [19722.681640625, 8794.28515625, 26305.5],
        1.2548587361706176
      ),
      new DatasetView(
        "",
        "",
        ["fibsem-uint8"],
        [29875.16015625, 5926.74658203125, 20979.5],
        0.8754852327896856
      ),
    ]
  ),
];

const contactSites = [
  ["ER - Ribosome Contact Sites", "er_ribo_contacts"],
  ["ER - Golgi Contact Sites", "er_golgi_contacts"],
  ["ER - Mito Contact Sites", "er_mito_contacts"],
  ["Endosome - ER Contact Sites", "endo_er_contacts"],
  ["ER - Plasma Membrane Contat Sites", "er_pm_contacts"],
  ["ER - Vesicle Contact Sites", "er_vesicle_contacts"],
  ["Golgi - Vesicle Contact Sites", "golgi_vesicle_contacts"],
  ["Endosome - Golgi Contact Sites", "endo_golgi_contacts"],
  ["Mito - Plasma Membrane Contact Sites", "mito_pm_contacts"],
  ["ER - Microtubule Contact Sites", "er_mt_contacts"],
  ["Endosome - Microtubule Contact Sites", "endo_mt_contacts"],
  ["Golgi - Microtubule Contact Sites", "golgi_mt_contacts"],
  ["Mitochondria - Microtubule Contact Sites", "mito_mt_contacts"],
  ["Microtubule - Nucleus Contact Sites", "mt_nucleus_contacts"],
  ["Microtubule - Vesicle Contact Sites", "mt_vesicle_contacts"],
  ["Microtubule - Plasma Membrane Contact Sites", "mt_pm_contacts"],
];

const analysisList = [
  [
    "Mitochondria Skeletons",
    "mito_skeleton",
    "Topological thinning to produce skeletons based on Lee et al., 1994",
  ],
  [
    "Mitochondria Skeletons - Longest Shortest Path",
    "mito_skeleton-lsp",
    "Longest shortest path within the pruned skeleton analyzed using Flyoyd Warshall algorithm.",
  ],
  [
    "ER Medial Surface",
    "er_medial-surface",
    "Topological thinning to produce medial surfaces based on Lee et al., 1994",
  ],
  [
    "Reconstructed ER from Medial Surface with Connected Components",
    "er_reconstructed",
    "Connected components of a reconstructed ER, created by expanding the ER medial surface by spheres centered at the medial surface with radii equal to the distance transform at each medial surface voxel.",
  ],
  [
    "Reconstructed ER from Medial Surface with Curvature",
    "er_curvature",
    "Curvature (planarity) mapped onto er_reconstructed, rescaled from 1 (planarity measure 0) to 255 (planarity measure 1); 0 is background",
  ],
  [
    "Ribosomes classified by contact surface",
    "ribo_classified",
    "Ribosomes classified according to the surface they are in contact with. Namely, planar ER, tubular ER, nucleus, and cytosolic (i.e. no contact).",
  ],
];

export default function Organelles() {
  const {appState} = useContext(AppContext);
  const neuroglancerAddress = appState.neuroglancerAddress;
  const datasets = appState.datasets;
  if (datasets.size === 0) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  const tableRows = tableData.map((row) => {
    const neuroglancer_urls = row.examples.map((v, idx) => {
      let dataset = datasets.get(demo_dataset_names[idx])!;
      let layers = v.volumeKeys.map(vk => {
        let result = dataset.volumes.get(vk)!.toLayer("image");
        return result;
      }); 
      return `${neuroglancerAddress}${dataset.makeNeuroglancerViewerState(layers as ImageLayer[], v.position, v.scale)}`;
    });
    return (
      <TableRow key={row.full_name}>
        <TableCell>{row.full_name}</TableCell>
        <TableCell>{row.short_name}</TableCell>
        <TableCell>{row.file_name}</TableCell>
        <TableCell>{row.description}</TableCell>
        {neuroglancer_urls.length === 0
          ? demo_dataset_names.map((v) => <TableCell></TableCell>)
          : neuroglancer_urls.map((v, idx) => (
              <TableCell key={idx}>
                <a href={v} target="_blank" rel="noopener noreferrer">
                  view
                </a>
              </TableCell>
            ))}
      </TableRow>
    );
  });

  const contactRows = contactSites.map((row) => {
    return (
      <TableRow key={row[0]}>
        <TableCell>{row[0]}</TableCell>
        <TableCell>{row[1]}</TableCell>
      </TableRow>
    );
  });

  const analysisRows = analysisList.map((row) => {
    return (
      <TableRow key={row[0]}>
        <TableCell>{row[0]}</TableCell>
        <TableCell>{row[1]}</TableCell>
        <TableCell>{row[2]}</TableCell>
      </TableRow>
    );
  });

  return (
    <Grid container spacing={3} className="organelles">
      <Grid item md={3}>
        <Paper className="toc">
          <ul>
            <li>
              <Typography variant="h5" gutterBottom>
                <a href="#organelles">Organelles</a>
              </Typography>
            </li>
            <li>
              <Typography variant="h5" gutterBottom>
                <a href="#contact_sites">Contact Sites</a>
              </Typography>
            </li>
            <li>
              <Typography variant="h5" gutterBottom>
                <a href="#analysis">Analysis</a>
              </Typography>
            </li>
          </ul>
        </Paper>
      </Grid>
      <Grid item md={9}>
        <p className="anchor" id="organelles" />
        <Typography variant="h3" gutterBottom>
          Organelles
        </Typography>
        <Table className="sticky border">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "20em" }}>Organelle</TableCell>
              <TableCell>Short Hand Name</TableCell>
              <TableCell>File Name</TableCell>
              <TableCell style={{ width: "30em" }}>Description</TableCell>
              {demo_dataset_names.map((v, idx) => (
                <TableCell key={idx} style={{ width: "5em" }}>
                  {v}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
        <p className="anchor" id="contact_sites" />
        <h3>Contact Sites</h3>
        <Table className="sticky border">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "20em" }}>Organelle</TableCell>
              <TableCell>File Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contactRows}</TableBody>
        </Table>
        <p className="anchor" id="analysis" />
        <h3>Analysis</h3>
        <Table className="sticky border">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "20em" }}>Organelle</TableCell>
              <TableCell>File Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{analysisRows}</TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}
