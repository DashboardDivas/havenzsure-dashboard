import { WorkOrdersTable } from "@/components/ui/work-orders-list"


export default function WorkOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
        <p className="text-muted-foreground">Manage and track all work orders</p>
      </div>

      <WorkOrdersTable />
    </div>
  )
}
