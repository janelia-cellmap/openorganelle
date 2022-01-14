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
import { DatasetView, makeLayer } from "../api/datasets";
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
        {name: "",
        description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [24834.125, 1468.32226562, 14897.5],
        scale: 6.834771272276192
      }
      ),
      new DatasetView({
        name: "",
        description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [28310.619140625, 962.44360352, 10741.5],
        scale: 2.671353019658504
      }),
      new DatasetView({
        name: "",
        description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [5523.84423828125, 5789.76855469, 15452.810546875],
        scale: 3.6039231119383004
      }),
      new DatasetView({
       name: "",
        description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [21723.33984375, 3200.5, 20980.5],
        scale: 5.430455441247891
      }),
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
      new DatasetView({
        name: "",
        description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [25878.65625, 3357.13305664, 16238.5],
        scale: 11.045498897968907
      }),
      new DatasetView({
       name: "",
        description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [20657.3203125, 1713.79736328, 19444.5],
        scale: 7.940871305346032
      }),
      new DatasetView({
       name: "",
        description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [18039.82421875, 5265.18310547, 18075.4453125],
        scale: 7.3670916293080895
      }),
      new DatasetView({
       name: "",
        description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [13386.9228515625, 2698.18066406, 18624.5],
        scale: 6.8347712722761855
      }),
    ]
  ),
  new OrganelleTableEntry(
    "Euchromatin",
    "E Chrom",
    "echrom",
    "Light, single chromatin within the nucleus. Euchromatin stain is lighter and less compact than heterochromatin. Nucleolus euchromatin (N-E Chrom) is not associated with or connected to euchromatin (E Chrom) outside the nucleolus.",
    [
      new DatasetView({
       name: "",
        description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [16978.822265625, 3478.24902344, 12897.5],
        scale: 0.9203723205358448
      }),
      new DatasetView({
        name: "",
       description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [27499.412109375, 1683.5, 18988.5],
        scale: 0.7203795921556103
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [17931.806640625, 5950.28173828, 6054.5],
       scale: 0.9871068435746017
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [15266.125, 3146.50537109, 18645.5],
       scale: 0.5444511834277151
      }),
    ]
  ),
  new OrganelleTableEntry(
    "Heterochromatin",
    "H Chrom",
    "hchrom",
    " Dark clusters of chromatin within the nucleus. Heterochromatin stain is darker and more compact than euchromatin. Nucleolus heterochromatin (N-H Chrom) is not associated with or connected to heterochromatin (H Chrom) outside the nucleolus. ",
    [
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [23998.06640625, 3474.69238281, 13858.5],
       scale: 3.428157707713824
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [25696.5, 2175.60620117, 10395.5],
       scale: 2.1641398950982564
      }),
      new DatasetView({
       name: "",
        description: "",
        sources: ["fibsem-uint8"],
        orientation: undefined,
        position: [9010.77734375, 3489.72070312, 21761.5],
        scale: 2.142606343351916
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [14548.23046875, 2014.20703125, 21364.5],
       scale: 6.001581425572742
      }),
    ]
  ),
  new OrganelleTableEntry(
    "Endoplasmic Reticulum",
    "ER",
    "er",
    "An extensive network of tubular structures often studded with ribosomes. The endoplasmic reticulum is distinct from multivesicular bodies based on connectivity; ER networks always connect back to themselves and ultimately connect back to the nuclear envelope. In contrast, the morphologically-similar multivesicular bodies are disconnected. ER exit sites (ERES), nuclear envelope (NE), and associated nuclear pores (NP) are included in the ER superclass.",
    [
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [35298.2265625, 1650.76318359, 16247.5],
       scale: 1.9003213537587145
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [11177.7099609375, 917.94506836, 19451.5],
       scale: 1.7367629472369266
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [13333.87109375, 5353.5, 18122.5],
       scale: 2.2078584209846404
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [28972.162109375, 2337.99316406, 18413.04296875],
       scale: 2.089705204245983
      }),
    ]
  ),
  new OrganelleTableEntry(
    "Endoplasmic Reticulum Exit Site",
    "ERES",
    "eres",
    " A cluster of tubular structures and vesicles that bud from the endoplasmic reticulum. Endoplasmic reticulum exit site lumen and morphology is generally consistent with the corresponding ER network. ",
    [
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [37011.81640625, 2337.63061523, 9993.68359375],
       scale: 2.489353418393179
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [13708.41796875, 801.31689453, 19057.5],
       scale: 3.0710606957499955
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [10793.9921875, 4420.38964844, 21908.5],
       scale: 3.2447003551933493
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [28965.1953125, 2486.55664062, 17615.0],
       scale: 2.309481419083985
      }),
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
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [11121.8115234375, 3096.53588867, 12878.5],
       scale: 2.69668436501776
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [39109.76953125, 1038.4909668, 18720.5],
       scale: 2.1749876914651223
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [17141.326171875, 3168.71875, 22145.427734375],
       scale: 1.6603410040994775
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [19509.19140625, 5320.70239258, 17616.5],
       scale: 2.1968466811703515
      }),
    ]
  ),
  new OrganelleTableEntry("Endosome membrane", "Endo mem", "endo-mem", "", []),
  new OrganelleTableEntry(
    "Extracellular Space",
    "ECS",
    "ecs",
    "Defined as any volume outside of the plasma membrane boundary, including both cellular plasma membrane and membrane surrounding secreted vesicles; it does not contain any stained organelles or molecules and is not defined by a particular morphology or contrast.",
    [
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [12469.8427734375, 5269.27416992, 12902.5],
       scale: 5.766256051903022
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [31238.453125, 3168.52783203, 18988.5],
       scale: 9.747618564959009
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [24350.47265625, 7878.56103516, 21720.86328125],
       scale: 11.212430236526277
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [7863.55078125, 3954.9440918, 18645.5],
       scale: 5.512526265224186
      }),
    ]
  ),
  new OrganelleTableEntry(
    "Golgi",
    "Golgi",
    "golgi",
    "Stacked, \u2018pancake-like\u2019 structures that uniformly morph and bend together. Gaps of a similar thickness to each Golgi layer compose a Golgi apparatus that often consists of 5-7 layers. Stacks may be interconnected and often connect to ER network and endosomal network (Endo). Surrounding and budding vesicles are often included in the Golgi network. ",
    [
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [23662.580078125, 1164.5, 13858.5],
       scale: 3.394046968588006
      }),
      new DatasetView({
       name: "",
        description:"",
        sources:["fibsem-uint8"],
        orientation: undefined,
        position: [31688.9375, 1541.73828125, 10175.521484375],
        scale: 5.269961228093141
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [11630.6279296875, 3264.52539062, 21721.5],
       scale: 3.148804967400616
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [19560.31640625, 3969.76147461, 21354.75390625],
       scale: 2.0897052042459654
      }),
    ]
  ),
  new OrganelleTableEntry("Golgi membrane", "Golgi mem", "golgi-mem", "", []),
  new OrganelleTableEntry(
    "Lipid Droplet",
    "LD",
    "ld",
    "Spherical organelles enclosed by a lipid monolayer and characterized by a shriveled, \u2018lumpy\u2019 morphology due to general staining. Lipid droplets (LD) are generally lighter than surrounding cytosol and have subtle membrane staining. ",
    [
      new DatasetView({
       name: "",
        description: "",
        sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [20307.119140625, 1169.5, 20728.369140625],
       scale: 1.816702428866956
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [16203.3857421875, 2216.5, 10311.6865234375],
       scale: 2.539641693244882
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [9503.7900390625, 3487.5, 23822.5],
       scale: 3.071060695749866
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [16734.732421875, 1403.5, 28098.5],
       scale: 2.552371700207675
      }),
    ]
  ),
  new OrganelleTableEntry("Lipid Droplet membrane", "LD mem", "ld-mem", "", []),
  new OrganelleTableEntry(
    "Lysosome",
    "Lyso",
    "lyso",
    "Spherical, dark lumen organelles that constitute the late endosomal network. Lysosomes can have multiple membranes; the lysosome class also includes autophagosomes, multivesicular bodies, endosomes, and peroxisomes as EM staining alone is not sufficient for differentiation.",
    [
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [22366.880859375, 1472.72314453, 15095.5],
       scale: 1.1700225304605227
      }),
      new DatasetView({
       name: "",
       description: "",
       sources: ["fibsem-uint8"],
       orientation: undefined,
       position: [23603.00390625, 3359.39880371, 10612.5],
       scale: 2.4769377164221504
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[2547.55810546875, 4914.5, 23793.65625],
        scale:1.816702428866914
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[8844.8916015625, 1501.5, 26958.734375],
        scale:4.043145610335109
      }),
    ]
  ),
  new OrganelleTableEntry("Lysosome membrane", "Lyso mem", "lyso-mem", "", []),
  new OrganelleTableEntry(
    "Microtubule",
    "MT",
    "mt",
    "Cylindrical, cytoskeletal polymers characterized by restricted curvature and a 25 nm diameter. Microtubules often run parallel, do not branch, and may appear to pierce through other organelles, especially ER.",
    [
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[25586.943359375, 2288.62158203, 23615.8984375],
        scale:1.5872818189033555
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[13792.28515625, 1377.53588867, 25946.884765625],
        scale:0.8976482469751267
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[27828.396484375, 2335.96386719, 20560.5],
        scale:0.9724107372692137
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[22084.671875, 3295.87939453, 20421.5],
        scale:1.2116983922845241
      }),
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
      new DatasetView({
       name: "",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[9410.2998046875, 2285.18066406, 14102.7353515625],
        scale:3.19639306033529
      }),
      new DatasetView({
       name: "",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[18499.74609375, 1444.45556641, 25864.5],
        scale:2.4893534183931534
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[29079.966796875, 3833.37988281, 20637.408203125],
        scale:2.980297135446793
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[21079.42578125, 4805.59375, 19289.5],
        scale:3.5149419332613245
      }),
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
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[17247.474609375, 958.34228516, 14103.5],
        scale:1.1877051565652172
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[21501.451171875, 802.11279297, 23836.5],
        scale:1.3324548668177507
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[15925.193359375, 5419.46533203, 21139.2109375],
        scale:1.643820335075574
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
       orientation: undefined,
        position:[22633.294921875, 3962.75927734, 10932.5],
        scale:1.5480916911588005
      }),
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
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[22141.791015625, 5167.29907227, 16684.5],
        scale:1.2300108683819138
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[21347.55859375, 776.5, 23604.87890625],
        scale:1.3324548668177507
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[18031.2109375, 6287.5, 18419.5],
        scale:1.248600102113731
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[19199.5, 4856.47216797, 12785.5],
        scale:0.7025933566522808
      }),
    ]
  ),
  new OrganelleTableEntry("Nuclear Pore outer", "NP out", "np-out", "", []),
  new OrganelleTableEntry(
    "Nucleolus",
    "Nucleolus",
    "nucleolus",
    "A dark, dense spherical structure within the nucleus containing heterochromatin (N-H Chrom) and euchromatin (N-E Chrom).",
    [
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[19707.3828125, 3363.71386719, 14673.0693359375],
        scale:4.76845811077735
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[24608.8359375, 1941.02392578, 18936.087890625],
        scale:7.553590441818405
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[10253.5244140625, 5160.5, 18631.701171875],
        scale:3.640143141371554
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[15892.5966796875, 2742.59667969, 12932.759765625],
        scale:5.737496729863766
      }),
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
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[23906.234375, 2988.21435547, 14617.5],
        scale:17.064887765049217
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[21988.5, 1963.40222168, 16180.466796875],
        scale:11.905768200734133
     } ),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[19402.25390625, 3960.81103516, 18437.5],
        scale:7.59145297147106
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[17277.40234375, 3218.35595703, 14914.5966796875],
        scale:17.58459096890281
      }),
    ]
  ),
  new OrganelleTableEntry(
    "Plasma Membrane",
    "PM",
    "pm",
    " A thin, extensive bilayer that surrounds the cell and separates extracellular space from cytosol. To be classified as plasma membrane, the membrane must always connect back to itself. Otherwise, the membrane is most likely part of the endosomal network (Endo). ",
    [
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[14104.39453125, 4262.57592773, 14857.5],
        scale:2.4278910635004314
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[35387.3203125, 2040.93847656, 16180.466796875],
        scale:2.4893534183931507
      }),
      new DatasetView({
       name: "",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[14141.5, 4449.41259766, 22384.5],
       scale: 3.7322938037215394
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[27586.201171875, 3758.46875, 14920.5],
        scale:3.71367891071658
      }),
    ]
  ),
  new OrganelleTableEntry(
    "Ribosome",
    "Ribo",
    "ribo",
    "Macromolecular structures characterized by darkly stained ellipsoid spots which result from diffraction-limited resolution. Ribosomes are often found in clusters bound to ER or suspended in cytosol. Point annotations in BigCat are used to demark the centroid of ribosomes in a volume. These are then painted into a separate volume as points and virtually expanded to 18 nm as needed.",
    [
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[5525.28515625, 1184.81933594, 15501.5],
        scale:1.1641870187448156
     } ),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[32975.51953125, 1882.84301758, 17141.5],
        scale:0.44799330334393583
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[7973.5419921875, 2063.87207031, 23764.01953125],
        scale:0.7460393034533427
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[15090.810546875, 2900.88818359, 25429.46484375],
        scale:1.0222673018968507
      }),
    ]
  ),
  new OrganelleTableEntry(
    "Vesicle",
    "Vesicle",
    "vesicle",
    " Small, spherical organelles less than 100 nm in diameter with lumen varying in color depending on protein content. Vesicles are often found in clusters surrounding Golgi and ER. ",
    [
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
       orientation: undefined,
        position:[2161.434814453125, 897.5, 15614.5],
        scale:1.2423726831244588
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[11943.3740234375, 1629.5, 17449.267578125],
       scale: 2.1641398950982507
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[19722.681640625, 3205.71484375, 26305.5],
        scale:1.2548587361706176
      }),
      new DatasetView({
        name:"",
        description:"",
        sources:["fibsem-uint8"],
        orientation:undefined,
        position:[29875.16015625, 2073.25341797, 20979.5],
        scale:0.8754852327896856
      }),
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
      let layers = v.sources.map(vk => {
        let result = makeLayer(dataset.volumes.get(vk)!, "image");
        return result;
      }); 
      return `${neuroglancerAddress}${dataset.makeNeuroglancerViewerState(layers as ImageLayer[], v.position, v.scale, v.orientation)}`;
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
