/* eslint-disable import/extensions */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import ReactFlow, {
  isEdge,
  removeElements,
  addEdge,
  Controls,
  Background,
} from 'react-flow-renderer';
import './CampaignEditor.css';
import ActionNode from './nodes/Action/ActionNode.jsx';
import TriggerNode from './nodes/EntryTrigger/TriggerNode.jsx';
import EntryTriggerNode from './nodes/EntryTrigger/EntryTriggerNode.jsx';
import DelayNode from './nodes/Delay/DelayNode';
import { transformCampaignToReactFlow } from './TransformCampaignToReactFlow';
import AutoZoom from './Autozoom';
import TaskNode from './nodes/Task/TaskNode';
import { tourDefaultData } from './defaultData/tour';

let id = 0;
const CampaignEditor = ({
  campaignData,
  onNewNodeDrop,
  onNodeClick,
  onPaneClick,
  onNewEdgeConnect,
  onNodeMoveEnd,
  onElementsDelete,
}) => {
  const reactFlowWrapper = useRef(null);
  const [firstLoad, setFirstLoad] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedCampaignData, setSelectedCampaignData] = useState(
    campaignData,
  );
  const [previousCampaignData, setPreviousCampaignData] = useState({});
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  if (campaignData !== previousCampaignData) {
    setSelectedCampaignData(campaignData);
    setPreviousCampaignData(campaignData);
  }

  const onNodeDragStop = (event, node) => {
    onNodeMoveEnd(node.id, node.position);
  };
  const onConnectStart = () => { };
  const onElementClick = (event, element) => {
    if (
      ['entryTriggerNode', 'triggerNode', 'message', 'delayNode', 'taskNode'].includes(
        element.type,
      )
    ) {
      onNodeClick(element);
    }
  };
  const snapGrid = [20, 20];
  const nodeTypes = {
    entryTriggerNode: EntryTriggerNode,
    triggerNode: TriggerNode,
    message: ActionNode,
    delayNode: DelayNode,
    taskNode: TaskNode
  };
  const edgeTypes = {};

  const removeHandleTextFromConnectedNodes = () => {
    elements.forEach((e) => {
      if (e.type) {
        const labelsToRemove = [];
        elements.forEach((ee) => {
          // Only edges
          if (e.id === ee.source) {
            labelsToRemove.push({
              labelText: ee.label
            })
          }
        });
         labelsToRemove.forEach((ltr) => {
           const {labelText} = ltr;
          if (
            ['When matched', 'When delivered', 'When sent', 'When passed'].includes(labelText)
          ) {
            const handleDomb = document.querySelector(
              `#handle-${e.id}b-text`,
            );
            if (handleDomb && handleDomb.style) {
              handleDomb.style.visibility = 'hidden ';
            }
          }
          if (
            [
              'If not online after waiting',
              'If not matched',
            ].includes(labelText)
          ) {
            const handleDomc = document.querySelector(
              `#handle-${e.id}c-text`,
            );
            if (handleDomc && handleDomc.style) {
              handleDomc.style.visibility = 'hidden ';
            }
          }
        });
      }
    });
  };

  useEffect(() => {
    const onChange = (event) => {
      setElements((els) =>
        els.map((e) => {
          if (isEdge(e)) {
            return e;
          }
          const color = event.target.value;
          return {
            ...e,
            data: {
              ...e.data,
              color,
            },
          };
        }),
      );
    };
    const data = transformCampaignToReactFlow(selectedCampaignData, onChange);
    setElements(data);
    if (data && data.length > 0) {
      setFirstLoad(true);
    }
  }, [selectedCampaignData]);

  useEffect(() => {
    setTimeout(() => {
      removeHandleTextFromConnectedNodes();
    }, 10);
  }, [elements]);

  const onLoad = (_reactFlowInstance) => {
    setReactFlowInstance(_reactFlowInstance);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const params = event.dataTransfer.getData('params');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left - 125,
      y: event.clientY - reactFlowBounds.top - 40,
    });
    let additionalData = {};
    if (type === 'entryTriggerNode' || type === 'triggerNode') {
      additionalData = {
        triggerPredicates: [{ value: [] }],
        triggerPredicateOperator: 'and',
        goalPredicate: null,
        goalTimeConstraintDays: 259200,
        evaluationValues: {
          days: 0,
          hours: 1,
          minutes: 0
        },
        evaluationTime: 3600,
        action: undefined,
        type,
        position,
        nodeId: `new_added_${id}`,
      };
    } else if (type === 'extra' && params === 'delay') {
      additionalData = {
        triggerPredicates: [{ value: [] }],
        triggerPredicateOperator: 'and',
        goalPredicate: null,
        goalTimeConstraintDays: 259200,
        evaluationValues: {
          days: 0,
          hours: 1,
          minutes: 0
        },
        evaluationTime: (3600),
        action: undefined,
        type: "delayNode",
        position,
        nodeId: `new_added_${id}`,
      };
    } else if (type === 'playbook' && params === 'task') {
      additionalData = {
        task: {
          name: "",
          description: "",
          dueDate: {
            interval: "day",
            intervalValue: 7,
            intervalMilliseconds: 86400,
          },
          tags: [],
          priority: "normal",
          assignedTo: "",
          attachToGroup: false,
          status: 0,
        },
        triggerPredicates: [{ value: [] }],
        triggerPredicateOperator: 'and',
        goalPredicate: null,
        goalTimeConstraintDays: 259200,
        action: undefined,
        type: "taskNode",
        position,
        nodeId: `new_added_${id}`,
      };
    } else if (type === 'message') {
      let config = {};
      switch (params) {
        case 'tour':
          config ={
            ...tourDefaultData
          }
          break;
        case 'email':
          config = {
            title: "Welcome to Engageful!",
            sendFromName: "",
            sendFromEmail: "",
            body: "", 
            previewText: "",
            avatar: "",
          };
          break;
        case 'slack':
          config = {
            message: "This message is sent from Engageful!",
            toChannelId: "",
          };
          break;
        case 'modalbox':
          config = {
            showCloseButton: true,
            backgroundImage: '',
            noThanksButton: false,
            showPoweredBy: false,
            position: "centered",
            cards: [],
          };
          break;
        case 'imagebox':
          config = {
            messageType: "imageBox",
            show: true,
            showModal: true,
            accentColor: "#4B4B4B",
            width: 550,
            title: "Hello there!",
            body:
                "Write your text, and remember that **markup** is supported.",
            action: "none",
            position: "centered",
            videoUrl: "",
            backgroundImage:
                "https://i.imgur.com/NOoiFMt.png",
            link: {
                text: "Learn more →",
                href: "",
                newTab: true,
                dismissOnClick: true,
            },
            buttons: [],
            withLink: false,
            noThanksButton: false,
            showPoweredBy: true,
          };
          break;
        case 'announcementbar':
          config = {
            show: true,
            backgroundColor: '#4b4b4b',
            secondaryBackgroundColor: '#4b4b4b',
            variant: 'floating', 
            title: '✨ We have just introduced a brand new awesome feature!',
            showPoweredBy: false,
            gradient: true,
            position: 'bottom',
            withLink: false,
            linkHref: '',
            linkText: 'Learn more →',
          };
          break;
        default:
          return;
      }
      additionalData = {
        triggerPredicates: [{ value: [] }],
        triggerPredicateOperator: 'and',
        goalPredicate: null,
        goalTimeConstraintDays: 259200,
        evaluationValues: {
          days: 0,
          hours: 1,
          minutes: 0
        },
        evaluationTime: (3600),
        name: '',
        type: 'message',
        position,
        action: { action: params, config },
        nodeId: `new_added_${id}`,
      };
    } else {
      return;
    }
    const newNode = {
      id: `new_added_${id}`,
      type,
      position,
      data: { newNode: true, label: `${type} node`, ...additionalData },
    };
    setElements((es) => es.concat(newNode));
    id++;
    onNewNodeDrop(newNode);
  };

  const onElementsRemove = (elementsToRemove) => {
    console.log('Elements to remove', elementsToRemove);
    elementsToRemove.forEach((eltr) => {
      // Show node helper text again
      // Ids look like the following: reactflow__edge-4c-3a
      // No easy way to find source handle, so we use the ID of the deleted edge.
      const handleId = eltr.id.split('-');
      // Handle helper text looks like: handle-4-c-text
      const sourceHandle = eltr.sourceHandle ? eltr.sourceHandle : 'b';
      const handleDom = document.querySelector(
        `#handle-${handleId[2]}${sourceHandle}-text`,
      );
      if (handleDom && handleDom.style) {
        handleDom.style.visibility = 'unset';
      }
    });
    setElements((els) => removeElements(elementsToRemove, els));
    onElementsDelete(elementsToRemove);
  };

  const onConnect = (params) => {
    const sourceNode = elements.find((el) => {
      return el.id === params.source;
    });
    let label;
    switch (sourceNode.type) {
      case 'entryTriggerNode':
        label = 'When Matched';
        break;
      case 'message':
        if (params.sourceHandle === 'b') {
          label = 'When matched';
        } else if (params.sourceHandle === 'c') {
          label = 'If Not Online After Waiting';
        }
        break;
      default:
        label = '';
        break;
    }

    // Hide handle helper text again
    // Ids look like the following: reactflow__edge-4c-3a
    // No easy way to find source handle, so we use the ID of the deleted edge.
    const handleId = params.source + params.sourceHandle;
    // Handle helper text looks like: handle-4-c-text
    const handleDom = document.querySelector(`#handle-${handleId}-text`);
    if (handleDom.style) {
      handleDom.style.visibility = 'hidden';
    }
    setElements((els) =>
      addEdge({ ...params, type: 'smoothedge', label }, els),
    );

    onNewEdgeConnect(params);
  };
  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        elements={elements}
        onElementClick={onElementClick}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onNodeDragStop={onNodeDragStop}
        onLoad={onLoad}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
      >
        <Controls />
        <Background />
        <AutoZoom nodesLoaded={firstLoad} count={elements.length} />
      </ReactFlow>
    </div>
  );
};
export default CampaignEditor;
