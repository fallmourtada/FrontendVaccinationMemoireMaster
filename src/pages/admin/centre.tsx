import { useState } from "react";
import PageContainer from "@/components/shared/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ArrowLeft, Pencil, Trash2, Plus, MapPinned, Image as ImageIcon } from "lucide-react";
import localityService from "@/services/locality.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type NavigationLevel = "regions" | "departments" | "districts" | "centres";

const normalizeRegionName = (value: string): string => value.trim().toUpperCase();
const REFERENCE_MAP_IMAGE =
  "file:///C:/Users/lenovo/.cursor/projects/c-Users-lenovo-ProjetMemoire-vaccination-web-vaccination-web/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_3265c571affe731d17ec229ab56c47de_images_senegal-card-97eb1c16-1e36-4cb2-b79c-305b8fcca90b.png";

const SENEGAL_REGIONS_DRAW = [
  { name: "SAINT-LOUIS", color: "#7b1fa2", labelX: 37, labelY: 14, points: "18,7 45,6 57,13 51,24 32,24 19,21 15,14" },
  { name: "LOUGA", color: "#3ea06b", labelX: 32, labelY: 29, points: "19,21 32,14 35,18 47,18 50,20 53,28 41,40 25,40 15,36 12,30 16,25" },
  { name: "MATAM", color: "#0f8db3", labelX: 61, labelY: 34, points: "51,24 57,13 72,15 77,28 83,39 79,48 66,52 57,52 50,47 45,45 43,35 49,33 50,27" },
  { name: "THIES", color: "#f2b300", labelX: 16, labelY: 35, points: "7,33 12,30 15,36 15,45 12,52 8,50 6,42" },
  { name: "DAKAR", color: "#d36b4f", labelX: 10, labelY: 37, points: "4,38 7,37 7,40 5,41" },
  { name: "DIOURBEL", color: "#35b729", labelX: 24, labelY: 43, points: "15,40 25,40 30,43 37,43 35,49 28,51 21,51 16,47" },
  { name: "FATICK", color: "#3b2aac", labelX: 20, labelY: 59, points: "16,50 21,51 20,57 18,64 14,66 12,61 12,54" },
  { name: "KAOLACK", color: "#a651a8", labelX: 26, labelY: 60, points: "20,57 27,53 34,53 35,59 34,66 25,66 18,64" },
  { name: "KAFFRINE", color: "#8b006d", labelX: 38, labelY: 53, points: "34,46 42,44 49,46 49,58 46,62 34,63 31,56 31,50" },
  { name: "TAMBACOUNDA", color: "#8a6436", labelX: 63, labelY: 60, points: "49,46 57,52 66,52 79,48 86,56 84,75 72,80 55,79 49,66" },
  { name: "ZIGUINCHOR", color: "#ff00c8", labelX: 20, labelY: 84, points: "15,76 26,76 26,84 27,90 20,95 14,94 11,85" },
  { name: "SEDHIOU", color: "#568f17", labelX: 32, labelY: 83, points: "26,76 34,76 44,78 44,89 37,94 27,90 26,84" },
  { name: "KOLDA", color: "#a69d45", labelX: 53, labelY: 80, points: "44,78 55,79 72,80 73,92 58,92 44,89" },
  { name: "KEDOUGOU", color: "#fff000", labelX: 79, labelY: 85, points: "73,77 84,75 96,83 95,95 81,95 73,92" },
] as const;

const REGION_LABEL_POSITION = SENEGAL_REGIONS_DRAW.map((region) => ({
  name: region.name,
  x: region.labelX,
  y: region.labelY,
}));

export default function CentrePage() {
  const queryClient = useQueryClient();
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>("regions");
  const [mapMode, setMapMode] = useState<"dessin" | "reference">("dessin");
  const [selectedRegion, setSelectedRegion] = useState<any | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [centreType, setCentreType] = useState<"CENTRE_DE_SANTE" | "POSTE_DE_SANTE">("CENTRE_DE_SANTE");

  const { data: regions = [] } = useQuery({
    queryKey: ["map-regions"],
    queryFn: () => localityService.getAllRegions(),
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["map-departments", selectedRegion?.id],
    queryFn: () => localityService.getDepartmentsByRegion(selectedRegion.id),
    enabled: !!selectedRegion?.id,
  });

  const { data: districts = [] } = useQuery({
    queryKey: ["map-districts", selectedDepartment?.id],
    queryFn: () => localityService.getDistrictsByDepartment(selectedDepartment.id),
    enabled: !!selectedDepartment?.id,
  });

  const { data: centres = [] } = useQuery({
    queryKey: ["map-centres", selectedDistrict?.id],
    queryFn: () => localityService.getCentresByDistrict(selectedDistrict.id),
    enabled: !!selectedDistrict?.id,
  });

  const invalidateHierarchyQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["map-regions"] });
    queryClient.invalidateQueries({ queryKey: ["map-departments"] });
    queryClient.invalidateQueries({ queryKey: ["map-districts"] });
    queryClient.invalidateQueries({ queryKey: ["map-centres"] });
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      if (currentLevel === "regions") {
        return localityService.createRegion(name.trim(), code.trim());
      }
      if (currentLevel === "departments" && selectedRegion?.id) {
        return localityService.createDepartment(selectedRegion.id, name.trim(), code.trim());
      }
      if (currentLevel === "districts" && selectedDepartment?.id) {
        return localityService.createDistrict(selectedDepartment.id, name.trim(), code.trim());
      }
      if (currentLevel === "centres" && selectedDistrict?.id) {
        return localityService.createCentre(selectedDistrict.id, name.trim(), phone.trim(), centreType);
      }
      throw new Error("Contexte de creation invalide.");
    },
    onSuccess: () => {
      setShowAddForm(false);
      setName("");
      setCode("");
      setPhone("");
      invalidateHierarchyQueries();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingItem?.id) throw new Error("Element invalide.");
      if (currentLevel === "centres") {
        return localityService.updateCentre(editingItem.id, { name: name.trim(), phone: phone.trim() });
      }
      return localityService.updateLocality(editingItem.id, { name: name.trim(), codification: code.trim() } as any);
    },
    onSuccess: () => {
      setShowEditForm(false);
      setEditingItem(null);
      setName("");
      setCode("");
      setPhone("");
      invalidateHierarchyQueries();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (item: any) => {
      if (currentLevel === "centres") return localityService.deleteCentre(item.id);
      return localityService.deleteLocality(item.id);
    },
    onSuccess: () => {
      invalidateHierarchyQueries();
    },
  });

  const handleBack = () => {
    if (currentLevel === "centres") {
      setCurrentLevel("districts");
      setSelectedDistrict(null);
      return;
    }
    if (currentLevel === "districts") {
      setCurrentLevel("departments");
      setSelectedDepartment(null);
      return;
    }
    if (currentLevel === "departments") {
      setCurrentLevel("regions");
      setSelectedRegion(null);
    }
  };

  const handleSelectRegionByName = (regionName: string) => {
    const region = regions.find(
      (item: any) => normalizeRegionName(item.name) === normalizeRegionName(regionName)
    );
    if (!region) return;
    setSelectedRegion(region);
    setSelectedDepartment(null);
    setSelectedDistrict(null);
    setCurrentLevel("departments");
  };

  const openCreateForm = () => {
    setShowEditForm(false);
    setEditingItem(null);
    setName("");
    setCode("");
    setPhone("");
    setCentreType("CENTRE_DE_SANTE");
    setShowAddForm(true);
  };

  const openEditForm = (item: any) => {
    setShowAddForm(false);
    setEditingItem(item);
    setName(item.name || "");
    setCode(item.codification || "");
    setPhone(item.phone || "");
    setShowEditForm(true);
  };

  const handleDelete = (item: any) => {
    if (!window.confirm(`Supprimer ${item.name} ?`)) return;
    deleteMutation.mutate(item);
  };

  return (
    <PageContainer
      title="Centres de vaccination"
      subtitle="Deux versions de carte + gestion backend (ajout, modification, suppression)"
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-700 dark:text-blue-300">Carte interactive du Sénégal</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={mapMode} onValueChange={(v) => setMapMode(v as "dessin" | "reference")} className="space-y-3">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="dessin">
                  <MapPinned className="mr-2 h-4 w-4" />
                  Carte dessinée
                </TabsTrigger>
                <TabsTrigger value="reference">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Carte référence
                </TabsTrigger>
              </TabsList>

              <div className="relative mx-auto h-[520px] w-full max-w-3xl rounded-xl border border-blue-100 bg-slate-100 p-2">
                {mapMode === "dessin" ? (
                  <svg viewBox="0 0 100 100" className="h-full w-full rounded-lg bg-[#d9d9d9]">
                    {SENEGAL_REGIONS_DRAW.map((region) => {
                      const isSelected =
                        selectedRegion && normalizeRegionName(selectedRegion.name) === normalizeRegionName(region.name);
                      return (
                        <g key={region.name} className="cursor-pointer" onClick={() => handleSelectRegionByName(region.name)}>
                          <polygon
                            points={region.points}
                            fill={region.color}
                            stroke={isSelected ? "#0f172a" : "#111827"}
                            strokeWidth={isSelected ? 0.6 : 0.35}
                            opacity={isSelected ? 0.88 : 1}
                          />
                          <text x={region.labelX} y={region.labelY} textAnchor="middle" fontSize="2.35" fontWeight={700} fill="#0f172a">
                            {region.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  <>
                    <img src={REFERENCE_MAP_IMAGE} alt="Carte Senegal reference" className="h-full w-full rounded-lg object-contain" />
                    {REGION_LABEL_POSITION.map((region) => {
                      const isSelected =
                        selectedRegion && normalizeRegionName(selectedRegion.name) === normalizeRegionName(region.name);
                      return (
                        <button
                          key={region.name}
                          type="button"
                          onClick={() => handleSelectRegionByName(region.name)}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                            isSelected ? "h-5 w-5 border-blue-700 bg-blue-600/70" : "h-4 w-4 border-white bg-blue-500/70"
                          }`}
                          style={{ left: `${region.x}%`, top: `${region.y}%` }}
                          title={region.name}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            </Tabs>
            <p className="mt-2 text-xs text-slate-500">
              Les deux versions sont conservées. Clique une région pour charger les données backend réelles.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">Exploration hiérarchique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={openCreateForm} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>

            {currentLevel !== "regions" && (
              <Button variant="outline" onClick={handleBack} className="w-full border-blue-200 text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}

            {showAddForm && (
              <div className="space-y-2 rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
                {currentLevel !== "centres" && (
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Codification (optionnel)" />
                )}
                {currentLevel === "centres" && (
                  <>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone (optionnel)" />
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={centreType}
                      onChange={(e) => setCentreType(e.target.value as "CENTRE_DE_SANTE" | "POSTE_DE_SANTE")}
                    >
                      <option value="CENTRE_DE_SANTE">Centre de Santé</option>
                      <option value="POSTE_DE_SANTE">Poste de Santé</option>
                    </select>
                  </>
                )}
                <div className="flex gap-2">
                  <Button onClick={() => createMutation.mutate()} disabled={!name.trim() || createMutation.isPending} size="sm">
                    Créer
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {showEditForm && (
              <div className="space-y-2 rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
                {currentLevel !== "centres" && (
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Codification (optionnel)" />
                )}
                {currentLevel === "centres" && (
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone (optionnel)" />
                )}
                <div className="flex gap-2">
                  <Button onClick={() => updateMutation.mutate()} disabled={!name.trim() || updateMutation.isPending} size="sm">
                    Enregistrer
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowEditForm(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {currentLevel === "regions" && (
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Clique une région sur la carte ou dans la liste ci-dessous.</p>
                {regions.map((region: any) => (
                  <div key={region.id} className="rounded-lg border border-blue-100 bg-white p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-between hover:bg-blue-50"
                      onClick={() => handleSelectRegionByName(region.name)}
                    >
                      <span>{region.name}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditForm(region)}>
                        <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(region)}>
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentLevel === "departments" && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Départements de {selectedRegion?.name}</p>
                {departments.length === 0 ? (
                  <p className="text-sm text-slate-500">Aucun département trouvé.</p>
                ) : (
                  departments.map((department: any) => (
                    <div key={department.id} className="rounded-lg border border-blue-100 bg-white p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-between hover:bg-blue-50"
                        onClick={() => {
                          setSelectedDepartment(department);
                          setSelectedDistrict(null);
                          setCurrentLevel("districts");
                        }}
                      >
                        <span>{department.name}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditForm(department)}>
                          <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(department)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {currentLevel === "districts" && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Districts de {selectedDepartment?.name}</p>
                {districts.length === 0 ? (
                  <p className="text-sm text-slate-500">Aucun district trouvé.</p>
                ) : (
                  districts.map((district: any) => (
                    <div key={district.id} className="rounded-lg border border-blue-100 bg-white p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-between hover:bg-blue-50"
                        onClick={() => {
                          setSelectedDistrict(district);
                          setCurrentLevel("centres");
                        }}
                      >
                        <span>{district.name}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditForm(district)}>
                          <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(district)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {currentLevel === "centres" && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Structures de santé - {selectedDistrict?.name}</p>
                {centres.length === 0 ? (
                  <p className="text-sm text-slate-500">Aucune structure trouvée.</p>
                ) : (
                  centres.map((centre: any) => (
                    <div key={centre.id} className="rounded-lg border border-blue-100 bg-white p-2">
                      <p className="text-sm font-semibold text-slate-800">{centre.name}</p>
                      <p className="text-xs text-slate-500">{centre.type}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditForm(centre)}>
                          <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(centre)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}