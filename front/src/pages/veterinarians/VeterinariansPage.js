import Page from "../../components/Page";
import React, { useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    Col,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap";
import VeterinariansManager from "../../managers/veterinarians.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment, MdAddBox, MdFilterAlt } from "react-icons/md";
import { sortBy } from "../../utils/sort";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    BlueIcon,
    GreenIcon,
    RedIcon,
    UserIcon,
    YellowIcon,
} from "../../utils/mapIcons";
import Switch from "../../components/Switch";
import SortableTable from "../../components/SortableTable";

L.Marker.prototype.options.icon = BlueIcon;

function VeterinariansPage({ ...props }) {
    const [veterinarians, setVeterinarians] = useState([]);
    const [filteredVeterinarians, setFilteredVeterinarians] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [userPosition, setUserPosition] = useState(null);
    const [filters, setFilters] = useState([
        {
            activated: false,
            name: "Gère les urgences",
            check: function (vet) {
                console.log(vet);
                return vet.emergencies === 1;
            },
        },
    ]);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );
    const [mapRef, setMapRef] = useState(React.createRef());

    const getAllVeterinarians = () => {
        VeterinariansManager.getAll()
            .then((veterinarians) => {
                return sortBy(veterinarians || [], "name");
            })
            .then((veterinarians) => {
                setVeterinarians(veterinarians);
                setFilteredVeterinarians(veterinarians);
            })
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    useEffect(() => {
        getAllVeterinarians();
    }, []);

    useEffect(() => {
        setFilteredVeterinarians(
            veterinarians.filter(
                (veterinarian) =>
                    filters.every((f) =>
                        f.activated == true
                            ? f.check(veterinarian) === true
                            : true
                    ) &&
                    veterinarian.name
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
            )
        );
    }, [searchText, filters]);

    useEffect(() => {
        if (mapRef !== null && mapRef.current !== null) {
            mapRef.invalidateSize();
            mapRef.locate().on("locationfound", function (e) {
                setUserPosition(e.latlng);
            });
        }
    }, [showMap]);

    useEffect(() => {
        if (mapRef !== null && mapRef.current !== null) {
            let filteredVeterinariansWithCoordinates =
                filteredVeterinarians.filter(
                    (vet) => vet.latitude !== null && vet.longitude !== null
                );

            if (filteredVeterinariansWithCoordinates.length > 0) {
                let latLngs = filteredVeterinariansWithCoordinates.map(
                    (vet) => [vet.latitude, vet.longitude]
                );
                if (userPosition !== null) {
                    latLngs.push(userPosition);
                }
                var bounds = new L.LatLngBounds(latLngs);
                mapRef.fitBounds(bounds);
            }
        }
    }, [filteredVeterinarians, mapRef, userPosition]);

    const showDetail = (veterinarian) => {
        props.history.push(`/veterinarians/${veterinarian.id}`);
    };

    const createVeterinarian = () => {
        props.history.push(`/veterinarians/new`);
    };

    const toggleMap = () => {
        setShowMap(!showMap);
    };

    const priceMarkerIcon = (veterinarian) => {
        switch (veterinarian.price_level) {
            case 0:
                return GreenIcon;
            case 1:
                return YellowIcon;
            case 2:
                return RedIcon;
            default:
                return BlueIcon;
        }
    };

    return (
        <Page
            className="VeterinariansPage"
            title="Liste des Vétérinaires"
            breadcrumbs={[{ name: "Vétérinaires", active: true }]}
            notificationSystemCallback={(notifSystem) => {
                setNotificationSystem(notifSystem);
            }}
        >
            <Row>
                <Col>
                    <Input
                        name="name"
                        placeholder="Rechercher un vétérinaire"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={"auto"}>
                    <Button
                        title="Créer un vétérinaire"
                        className="ms-2"
                        onClick={createVeterinarian}
                        color={"success"}
                    >
                        <MdAddBox />
                    </Button>
                    <Button
                        title="Rafraîchir les données"
                        className="ms-2"
                        onClick={getAllVeterinarians}
                    >
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>
            <Card>
                <CardBody>
                    <Row>
                        <Col xs={"auto"} className="mb-0 border-end">
                            <MdFilterAlt />
                        </Col>
                        {filters.map((filter) => {
                            return (
                                <Col className="mb-0">
                                    <Label>{filter.name}</Label>
                                    <Switch
                                        id={filter.name}
                                        isOn={filter.activated}
                                        handleToggle={() => {
                                            setFilters((previous) =>
                                                previous.map((f) =>
                                                    f.name === filter.name
                                                        ? {
                                                              ...f,
                                                              activated:
                                                                  !f.activated,
                                                          }
                                                        : f
                                                )
                                            );
                                        }}
                                    />
                                </Col>
                            );
                        })}
                    </Row>
                </CardBody>
            </Card>

            <br />

            <Row>
                <Col xs={12}>
                    <Nav tabs>
                        <NavItem className="active">
                            <NavLink disabled={!showMap} onClick={toggleMap}>
                                Liste
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink disabled={showMap} onClick={toggleMap}>
                                Carte
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={showMap ? "2" : "1"}>
                        <TabPane tabId="1">
                            <Row>
                                <Col xs={12} className="table-responsive">
                                    <SortableTable
                                        columns={[
                                            {
                                                key: "name",
                                                value: "Nom",
                                                isMain: true,
                                            },
                                            {
                                                key: "mail",
                                                value: "E-mail",
                                                isMain: false,
                                            },
                                            {
                                                key: "phone",
                                                value: "Téléphone",
                                                isMain: false,
                                            },
                                            {
                                                key: "price",
                                                value: "Tarif",
                                            },
                                            {
                                                key: "veterinarianDetail",
                                                value: "Fiche vétérinaire",
                                                isMain: false,
                                                sortable: false,
                                            },
                                        ]}
                                        values={filteredVeterinarians.map(
                                            (vet) => {
                                                return {
                                                    name: vet.name,
                                                    mail: vet.mail,
                                                    phone: vet.phone,
                                                    price: vet.price_level_text,
                                                    veterinarianDetail: (
                                                        <Button
                                                            title="Voir le détail"
                                                            color="info"
                                                            onClick={() =>
                                                                showDetail(vet)
                                                            }
                                                        >
                                                            <MdAssignment />
                                                        </Button>
                                                    ),
                                                };
                                            }
                                        )}
                                    />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col xs={12}>
                                    <MapContainer
                                        ref={setMapRef}
                                        center={[47.207959, -1.549425]}
                                        zoom={12}
                                        scrollWheelZoom={false}
                                        style={{
                                            height: "400px",
                                            width: "100%",
                                        }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {filteredVeterinarians
                                            .filter((vet) => {
                                                return (
                                                    vet.latitude !== null &&
                                                    vet.longitude !== null
                                                );
                                            })
                                            .map((veterinarian) => {
                                                return (
                                                    <Marker
                                                        title={
                                                            veterinarian.name
                                                        }
                                                        key={veterinarian.id}
                                                        position={[
                                                            veterinarian.latitude,
                                                            veterinarian.longitude,
                                                        ]}
                                                        icon={priceMarkerIcon(
                                                            veterinarian
                                                        )}
                                                        pane="markerPane"
                                                    >
                                                        <Popup>
                                                            <div className="text-center">
                                                                {
                                                                    veterinarian.name
                                                                }
                                                                <br />
                                                                <span
                                                                    title={
                                                                        veterinarian.price_level_tooltip
                                                                    }
                                                                >
                                                                    {
                                                                        veterinarian.price_level_text
                                                                    }
                                                                </span>
                                                                <br />
                                                                <div className="pt-2">
                                                                    <Button
                                                                        title="Voir le détail"
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            showDetail(
                                                                                veterinarian
                                                                            );
                                                                        }}
                                                                    >
                                                                        <MdAssignment />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                );
                                            })}
                                        {userPosition !== null && (
                                            <Marker
                                                title={"Ma position"}
                                                key={"user_position"}
                                                position={[
                                                    userPosition.lat,
                                                    userPosition.lng,
                                                ]}
                                                icon={UserIcon}
                                                interactive={false}
                                                pane="overlayPane"
                                            ></Marker>
                                        )}
                                    </MapContainer>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </Page>
    );
}
export default VeterinariansPage;
