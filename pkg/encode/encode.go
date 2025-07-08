package encode

import "google.golang.org/protobuf/proto"

// DeterministicMarshal encodes msg with deterministic field ordering so that
// the same logical Envelope yields identical byte sequence across languages.
func DeterministicMarshal(msg proto.Message) ([]byte, error) {
	return proto.MarshalOptions{Deterministic: true}.Marshal(msg)
}
