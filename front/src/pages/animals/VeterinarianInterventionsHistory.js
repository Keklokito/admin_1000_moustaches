import React, { useState } from "react";
import { MdAddBox, MdAssignment } from "react-icons/md";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Table,
} from "reactstrap";
import VeterinarianInterventionsManager from "../../managers/veterinarianInterventions.manager";
import VeterinarianInterventionModal from "./VeterinarianInterventionModal";

function VeterinarianInterventionsHistory({
    animalId,
    veterinarianInterventions,
    notificationSystem,
    shouldRefresh,
    ...props
}) {
    const [modalVeterianIntervention, setModalVeterinarianIntervention] =
        useState(null);
    const [
        showVeterinarianInterventionModal,
        setShowVeterinarianInterventionModal,
    ] = useState(false);

    const showDetail = (veterinarianIntervention) => {
        setModalVeterinarianIntervention(veterinarianIntervention);
        setShowVeterinarianInterventionModal(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <Row>
                        <Col>
                            <h3>Historique des interventions vétérinaires</h3>
                        </Col>
                        <Col xs={"auto"}>
                            <Button
                                color="primary"
                                onClick={() => {
                                    setModalVeterinarianIntervention(
                                        VeterinarianInterventionsManager.createVeterinarianIntervention()
                                    );
                                    setShowVeterinarianInterventionModal(true);
                                }}
                            >
                                <MdAddBox />
                            </Button>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody className="table-responsive">
                    <Table {...{ striped: true }}>
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Notes</th>
                                <th scope="col">Voir plus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {veterinarianInterventions
                                .sort((a, b) =>
                                    a.date < b.date
                                        ? -1
                                        : a.date > b.date
                                        ? 1
                                        : 0
                                )
                                .map((veterinarianIntervention, index) => (
                                    <tr>
                                        <th scope="row">
                                            {
                                                veterinarianIntervention
                                                    .date_object.readable
                                            }
                                        </th>
                                        <td>
                                            {
                                                veterinarianIntervention.description
                                            }
                                        </td>
                                        <td>
                                            <Button
                                                color="info"
                                                onClick={() =>
                                                    showDetail(
                                                        veterinarianIntervention
                                                    )
                                                }
                                            >
                                                <MdAssignment />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

            {modalVeterianIntervention !== null && (
                <VeterinarianInterventionModal
                    animalId={animalId}
                    veterinarianIntervention={modalVeterianIntervention}
                    show={showVeterinarianInterventionModal}
                    handleClose={(shouldReload) => {
                        setShowVeterinarianInterventionModal(false);
                        setModalVeterinarianIntervention(null);

                        if (shouldReload) {
                            shouldRefresh();
                        }
                    }}
                    notificationSystem={notificationSystem}
                />
            )}
        </>
    );
}
export default VeterinarianInterventionsHistory;
