class Node {
    constructor(id, name, quantity, price) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.next = null;
    }
}
 
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    append(id, name, quantity, price) {
        const newNode = new Node(id, name, quantity, price);
        if (this.head === null) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
 
    findById(id) {
        let current = this.head;
        while (current !== null) {
            if (current.id === id) {
                return current;
            }
            current = current.next;
        }
        return null;
    }
 
    deleteById(id) {
        if (this.head === null) return false;
 
        if (this.head.id === id) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
 
        let current = this.head;
        while (current.next !== null) {
            if (current.next.id === id) {
                current.next = current.next.next;
                this.size--;
                return true;
            }
            current = current.next;
        }
        return false;
    }
 
    toArray() {
        let arr = [];
        let current = this.head;
        while (current !== null) {
            arr.push({
                id: current.id,
                name: current.name,
                quantity: current.quantity,
                price: current.price
            });
            current = current.next;
        }
        return arr;
    }
}
 
let inventoryList = new LinkedList();
let autoIncId = 10001;
let editTargetId = null;
 
function setMessage(text) {
    document.getElementById('messageOutput').innerText = text;
}
 
function handleSubmit() {
    const name = document.getElementById('itemName').value.trim();
    const qty = parseFloat(document.getElementById('quantity').value);
    const prc = parseFloat(document.getElementById('price').value);
 
    if (name === "") {
        setMessage("Please enter the item name.");
        return;
    }
 
    if (isNaN(qty) || qty <= 0) {
        setMessage("Quantity must be greater than zero.");
        return;
    }
 
    if (isNaN(prc) || prc <= 0) {
        setMessage("Price must be greater than zero.");
        return;
    }
 
    if (editTargetId === null) {
        // Append operation using Linked List structure
        inventoryList.append(autoIncId, name, qty, prc);
        setMessage(`Record ${autoIncId} was added successfully.`);
        autoIncId++;
    } else {
        const nodeToUpdate = inventoryList.findById(editTargetId);
        if (nodeToUpdate) {
            nodeToUpdate.name = name;
            nodeToUpdate.quantity = qty;
            nodeToUpdate.price = prc;
            setMessage(`Record ${editTargetId} was updated successfully.`);
        }
        resetFormState();
    }
 
    clearInputs();
    renderTable();
}
 
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    let grandTotal = 0;
 
    const records = inventoryList.toArray();
 
    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: left;">No item records available.</td></tr>`;
        document.getElementById('grandTotalCell').innerText = "0";
        return;
    }
 
    records.forEach(record => {
        const subtotal = record.quantity * record.price;
        grandTotal += subtotal;
 
        const tr = document.createElement('tr');
        tr.innerHTML = `
<td>${record.id}</td>
<td>${record.name}</td>
<td>${record.quantity}</td>
<td>${record.price}</td>
<td>${subtotal}</td>
<td>
<button onclick="initiateUpdate(${record.id})">Update</button>
<button onclick="deleteRecord(${record.id})">Delete</button>
</td>
        `;
        tbody.appendChild(tr);
    });
 
    document.getElementById('grandTotalCell').innerText = grandTotal;
}
 
function initiateUpdate(id) {
    editTargetId = id;
    const record = inventoryList.findById(id);
    if (!record) return;
 
    document.getElementById('itemName').value = record.name;
    document.getElementById('quantity').value = record.quantity;
    document.getElementById('price').value = record.price;
 
    setMessage(`You are updating record ${id}.`);
    const actionsDiv = document.getElementById('formActions');
    actionsDiv.innerHTML = `
<button id="saveUpdateBtn" onclick="handleSubmit()">Save Update</button>
<button id="cancelUpdateBtn" onclick="cancelUpdate()">Cancel Update</button>
    `;
}
 
function cancelUpdate() {
    resetFormState();
    clearInputs();
    setMessage("Update was cancelled.");
}
 
function resetFormState() {
    editTargetId = null;
    const actionsDiv = document.getElementById('formActions');
    actionsDiv.innerHTML = `<button id="submitBtn" onclick="handleSubmit()">Add Item</button>`;
}
 
function deleteRecord(id) {
    inventoryList.deleteById(id);
    setMessage(`Record ${id} was deleted successfully.`);
    renderTable();
}
 
function clearInputs() {
    document.getElementById('itemName').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('price').value = '';
}