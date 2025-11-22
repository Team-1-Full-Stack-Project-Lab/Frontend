import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Users } from "lucide-react"
import { useEffect, useState } from "react"

export type RoomData = {
  adults: number
  children: number
}

type TravelersSelectorProps = {
  onChange?: (totalTravelers: number, rooms: RoomData[]) => void
  initialRooms?: RoomData[]
  className?: string
}

export function TravelersSelector({ onChange, initialRooms, className }: TravelersSelectorProps) {
  const [rooms, setRooms] = useState<RoomData[]>(
    initialRooms || [{ adults: 1, children: 0 }]
  )
  const [open, setOpen] = useState(false)

  const totalTravelers = rooms.reduce((acc, room) => acc + room.adults + room.children, 0)

  useEffect(() => {
    onChange?.(totalTravelers, rooms)
  }, [rooms, totalTravelers, onChange])

  const updateRoom = (index: number, field: keyof RoomData, value: number) => {
    const newRooms = [...rooms]
    newRooms[index] = { ...newRooms[index], [field]: value }
    setRooms(newRooms)
  }

  const addRoom = () => {
    setRooms([...rooms, { adults: 1, children: 0 }])
  }

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      const newRooms = rooms.filter((_, i) => i !== index)
      setRooms(newRooms)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={`relative flex-1 cursor-pointer ${className}`}>
          <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <div className="flex h-10 w-full items-center rounded-full border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background">
            <span className="text-foreground">
              {totalTravelers} travelers, {rooms.length} room{rooms.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="grid gap-4 max-h-[300px] overflow-y-auto pr-2">
          {rooms.map((room, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium leading-none">Room {index + 1}</h4>
                {rooms.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-destructive hover:text-destructive/90"
                    onClick={() => removeRoom(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Adults</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateRoom(index, 'adults', Math.max(1, room.adults - 1))}
                    disabled={room.adults <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-4 text-center text-sm">{room.adults}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateRoom(index, 'adults', room.adults + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Children</div>
                  <div className="text-xs text-muted-foreground">Ages 0 to 17</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateRoom(index, 'children', Math.max(0, room.children - 1))}
                    disabled={room.children <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-4 text-center text-sm">{room.children}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateRoom(index, 'children', room.children + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {index < rooms.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex flex-col gap-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary/90 hover:bg-primary/10"
            onClick={addRoom}
          >
            Add another room
          </Button>
          
          <Button className="w-full" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
