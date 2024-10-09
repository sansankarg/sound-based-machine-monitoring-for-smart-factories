import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./AuthContext";

const PlantManager = () => {
  const [plantName, setPlantName] = useState("");
  const [plantDescription, setPlantDescription] = useState("");
  const [isPlantCreated, setIsPlantCreated] = useState(false);
  const [zones, setZones] = useState([]);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneDescription, setNewZoneDescription] = useState("");
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(null);
  const [machineName, setMachineName] = useState("");
  const [micIndex, setMicIndex] = useState("");
  const [machineDescription, setMachineDescription] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  const [editingZoneIndex, setEditingZoneIndex] = useState(null);
  const [editingMachineIndex, setEditingMachineIndex] = useState(null);
  const [editedZoneName, setEditedZoneName] = useState("");
  const [editedZoneDescription, setEditedZoneDescription] = useState("");
  const [editedMachineName, setEditedMachineName] = useState("");
  const [editedMicIndex, setEditedMicIndex] = useState("");
  const [editedMachineDescription, setEditedMachineDescription] = useState("");

  const { username } = useAuth();

  useEffect(()=>{
    const fetchPlantDetails= async ()=>{
      try{
        const response=await axios.get("http://localhost:5007/plant",{
          params:{username}
        });
        const plantData=response.data.plantdata;

        if(plantData){
          setPlantName(plantData.plantname);
          setPlantDescription(plantData.plantdescription);
          setZones(plantData.zones || [])
          setIsPlantCreated(true)
          setIsEditing(false);
        }
      }catch(error)
      {
        console.log("Error fetching plant data",error)
      }
    }
    fetchPlantDetails();
  },[])

  const handleCreatePlant = () => {
    if (plantName.trim() && plantDescription.trim()) {
      setIsPlantCreated(true);
    }
  };

  const addZone = () => {
    if (newZoneName.trim() && newZoneDescription.trim()) {
      setZones((prevZones) => [
        ...prevZones,
        { zoneName: newZoneName, zoneDescription: newZoneDescription, machines: [] },
      ]);
      setNewZoneName("");
      setNewZoneDescription("");
      setSelectedZoneIndex(zones.length);
    }
  };

  const handleZoneSelect = (index) => {
    setSelectedZoneIndex(index);
  };

  const handleAddMachine = () => {
    if (
      selectedZoneIndex !== null &&
      machineName.trim() &&
      micIndex.trim() &&
      machineDescription.trim()
    ) {
      const updatedZones = zones.map((zone, index) => {
        if (index === selectedZoneIndex) {
          return {
            ...zone,
            machines: [
              ...zone.machines,
              { machineName, micIndex: parseInt(micIndex), machineDescription },
            ],
          };
        }
        return zone;
      });
      setZones(updatedZones);
      setMachineName("");
      setMicIndex("");
      setMachineDescription("");
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    sendDataToBackend();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const sendDataToBackend = async () => {
    try {
      const dataToSend = {
        username,
        plantName,
        plantDescription,
        zones,
      };
      console.log(dataToSend)
      const response = await axios.post("http://localhost:5007/industry", dataToSend);
      console.log("Data sent successfully", response.data);
    } catch (error) {
      console.error("Error sending data to backend", error);
    }
  };

  const handleZoneEdit = (index) => {
    setEditingZoneIndex(index);
    setEditedZoneName(zones[index].zoneName);
    setEditedZoneDescription(zones[index].zoneDescription);
  };

  const handleMachineEdit = (zoneIndex, machineIndex) => {
    setEditingMachineIndex(machineIndex);
    const machine = zones[zoneIndex].machines[machineIndex];
    setEditedMachineName(machine.machineName);
    setEditedMicIndex(machine.micIndex);
    setEditedMachineDescription(machine.machineDescription);
  };

  const handleZoneUpdate = (index) => {
    const updatedZones = zones.map((zone, i) => {
      if (i === index) {
        return { ...zone, zoneName: editedZoneName, zoneDescription: editedZoneDescription };
      }
      return zone;
    });
    setZones(updatedZones);
    setEditingZoneIndex(null); // Exit editing mode after update
  };

  const handleMachineUpdate = (zoneIndex, machineIndex) => {
    const updatedZones = zones.map((zone, i) => {
      if (i === zoneIndex) {
        const updatedMachines = zone.machines.map((machine, j) => {
          if (j === machineIndex) {
            return {
              ...machine,
              machineName: editedMachineName,
              micIndex: editedMicIndex,
              machineDescription: editedMachineDescription,
            };
          }
          return machine;
        });
        return { ...zone, machines: updatedMachines };
      }
      return zone;
    });
    setZones(updatedZones);
    setEditingMachineIndex(null); // Exit editing mode after update
  };

  return (
    <div className="container-fluid my-5" style={{ height: "calc(100vh - 70px)" }}>
      {!isPlantCreated && (
        <div className="card p-4 mb-4">
          <div className="mb-3">
            <label className="form-label">Plant Name:</label>
            <input
              type="text"
              className="form-control"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="Enter plant name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Plant Description:</label>
            <textarea
              className="form-control"
              value={plantDescription}
              onChange={(e) => setPlantDescription(e.target.value)}
              placeholder="Enter plant description"
            ></textarea>
          </div>
          <button className="btn btn-primary" onClick={handleCreatePlant}>
            Create Plant
          </button>
        </div>
      )}

      {isPlantCreated && (
        <div className="row" style={{ height: "100%" }}>
          <div className="col-md-4" style={{ paddingRight: "20px" }}>
            <div className="card p-4 mb-4" style={{ height: "100%" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">{plantName}</h3>
                {isEditing && (
                  <button className="btn btn-danger" onClick={handleSave}>
                    Save
                  </button>
                )}
                {isPlantCreated && !isEditing && (
                  <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-primary btn-sm" onClick={handleEdit}>
                      Edit
                    </button>
                  </div>
                )}
              </div>
              <h5 className="mb-3">Zones</h5>

              {zones.length > 0 ? (
                <ul className="list-group mb-3">
                  {zones.map((zone, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer", padding: "10px", marginBottom: "10px" }}
                      onClick={() => handleZoneSelect(index)}
                    >
                      {editingZoneIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={editedZoneName}
                            onChange={(e) => setEditedZoneName(e.target.value)}
                            placeholder="Edit zone name"
                          />
                          <input
                            type="text"
                            value={editedZoneDescription}
                            onChange={(e) => setEditedZoneDescription(e.target.value)}
                            placeholder="Edit zone description"
                          />
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleZoneUpdate(index)}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{zone.zoneName}</span>
                          {isEditing && (
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleZoneEdit(index);
                              }}
                            >
                              Edit
                            </button>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No zones added yet.</p>
              )}

              {isEditing && (
                <div>
                  <div className="mb-3">
                    <label className="form-label">Zone Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                      placeholder="Enter zone name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Zone Description:</label>
                    <textarea
                      className="form-control"
                      value={newZoneDescription}
                      onChange={(e) => setNewZoneDescription(e.target.value)}
                      placeholder="Enter zone description"
                    ></textarea>
                  </div>
                  <button className="btn btn-success btn-sm mb-3" onClick={addZone}>
                    Add Zone
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-8">
            <div className="card p-4" style={{ height: "100%" }}>
              {selectedZoneIndex !== null ? (
                <>
                  <h5>Machines in {zones[selectedZoneIndex].zoneName}</h5>
                  <ul className="list-group">
                    {zones[selectedZoneIndex].machines.length > 0 ? (
                      zones[selectedZoneIndex].machines.map((machine, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {editingMachineIndex === index ? (
                            <>
                              <input
                                type="text"
                                value={editedMachineName}
                                onChange={(e) => setEditedMachineName(e.target.value)}
                                placeholder="Edit machine name"
                              />
                              <input
                                type="number"
                                value={editedMicIndex}
                                onChange={(e) => setEditedMicIndex(e.target.value)}
                                placeholder="Edit mic index"
                              />
                              <input
                                type="text"
                                value={editedMachineDescription}
                                onChange={(e) => setEditedMachineDescription(e.target.value)}
                                placeholder="Edit machine description"
                              />
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleMachineUpdate(selectedZoneIndex, index)}
                              >
                                Save
                              </button>
                            </>
                          ) : (
                            <>
                              <span>{machine.machineName}</span>
                              {isEditing && (
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleMachineEdit(selectedZoneIndex, index)}
                                >
                                  Edit
                                </button>
                              )}
                            </>
                          )}
                        </li>
                      ))
                    ) : (
                      <p>No machines added yet.</p>
                    )}
                  </ul>

                  {isEditing && (
                    <div>
                      <div className="mb-3">
                        <label className="form-label">Machine Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          value={machineName}
                          onChange={(e) => setMachineName(e.target.value)}
                          placeholder="Enter machine name"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Mic Index:</label>
                        <input
                          type="number"
                          className="form-control"
                          value={micIndex}
                          onChange={(e) => setMicIndex(e.target.value)}
                          placeholder="Enter mic index"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Machine Description:</label>
                        <textarea
                          className="form-control"
                          value={machineDescription}
                          onChange={(e) => setMachineDescription(e.target.value)}
                          placeholder="Enter machine description"
                        ></textarea>
                      </div>
                      <button className="btn btn-success btn-sm mb-3" onClick={handleAddMachine}>
                        Add Machine
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p>Select a zone to view and manage machines.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantManager;